import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { logger } from '@/lib/logger';

const VALID_COUNTRIES = ['japan', 'korea', 'china'];
const CHINA_BASE_URL = 'https://new.worldcar.ru';
const PRIORITY_BASES: Record<string, string> = {
  japan: 'https://priority-auto.ru/auto-from-japan/',
  korea: 'https://priority-auto.ru/auto-from-korea/',
};
const MAX_URL_LENGTH = 2000;
const MAX_ID_LENGTH = 64;
const MAX_PARAMS_BYTES = 8192;
const SAFE_ID_REGEX = /^[A-Za-z0-9_-]{1,64}$/;

export async function GET(
  request: NextRequest,
  { params }: { params: { country: string; id: string } }
) {
  const startTime = Date.now();

  try {
    const { country, id } = params;

    if (!SAFE_ID_REGEX.test(id) || id.length > MAX_ID_LENGTH) {
      return NextResponse.json({ error: 'Invalid id format' }, { status: 400 });
    }

    logger.apiRequest('GET', `/api/cars/${country}/${id}`, {
      country,
      id,
      searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    });

    if (!VALID_COUNTRIES.includes(country)) {
      return NextResponse.json({ error: 'Invalid country' }, { status: 400 });
    }

    let parserPath: string;
    let parserDir: string;

    switch (country) {
      case 'japan':
        parserDir = '/var/www/auto-pars/japan';
        parserPath = path.join(parserDir, 'J-priority-auto-detail.py');
        break;
      case 'korea':
        parserDir = '/var/www/auto-pars/korea';
        parserPath = path.join(parserDir, 'K-priority-auto-detail.py');
        break;
      case 'china':
        parserDir = '/var/www/auto-pars/new.worldcar-ru';
        parserPath = path.join(parserDir, 'china-detail.py');
        break;
      default:
        return NextResponse.json({ error: 'Unsupported country' }, { status: 400 });
    }

    if (!fs.existsSync(parserPath)) {
      return NextResponse.json({ error: 'Detail parser not found' }, { status: 500 });
    }

    let detailParams: any;

    if (country === 'china') {
      const detailUrl = request.nextUrl.searchParams.get('detail_url');
      if (!detailUrl) {
        return NextResponse.json(
          { error: 'Detail URL required for China catalog' },
          { status: 400 }
        );
      }
      try {
        const normalized = normalizeChinaUrl(detailUrl);
        detailParams = { detail_url: normalized };
      } catch {
        return NextResponse.json({ error: 'Invalid detail_url for China catalog' }, { status: 400 });
      }
    } else {
      const rawDetailUrl = request.nextUrl.searchParams.get('detail_url') || undefined;
      try {
        const safeDetailUrl = normalizePriorityDetailUrl(rawDetailUrl, country);
        detailParams = {
          lot: id,
          detail_url: safeDetailUrl,
        };
      } catch {
        return NextResponse.json({ error: 'Invalid detail_url' }, { status: 400 });
      }
    }

    const result = await runDetailParser(parserPath, parserDir, detailParams, country);
    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: result,
      duration,
      country,
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        duration,
      },
      { status: 500 }
    );
  }
}

async function runDetailParser(
  parserPath: string,
  parserDir: string,
  params: any,
  country: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined)
    );

    // china: передаем URL аргументом, парсер сам качает html
    const isChina = country === 'china';
    const inputData = JSON.stringify(cleanParams);
    if (!isChina && Buffer.byteLength(inputData) > MAX_PARAMS_BYTES) {
      return reject(new Error('Request parameters too large'));
    }

    const args = isChina && cleanParams.detail_url ? [cleanParams.detail_url] : [];
    const pythonProcess = spawn('python3', [parserPath, ...args], {
      cwd: parserDir,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let output = '';
    let errorOutput = '';

    if (!isChina) {
      pythonProcess.stdin.write(inputData);
      pythonProcess.stdin.end();
    }

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          let cleanOutput = output;
          const jsonStartIndex = output.indexOf('{');
          if (jsonStartIndex !== -1) cleanOutput = output.substring(jsonStartIndex);
          const parserResult = JSON.parse(cleanOutput);

          let carDetail: any = {};
          if (parserResult.results && Array.isArray(parserResult.results) && parserResult.results.length > 0) {
            carDetail = parserResult.results[0];
          } else if (parserResult.car) {
            carDetail = parserResult.car;
          } else {
            carDetail = parserResult;
          }

          resolve(carDetail);
        } catch (err) {
          reject(new Error(`Failed to parse detail parser output: ${err}`));
        }
      } else {
        reject(new Error(`Detail parser failed with code ${code}: ${errorOutput}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(error);
    });

    setTimeout(() => {
      pythonProcess.kill();
      reject(new Error('Detail parser timeout'));
    }, 30000);
  });
}

function normalizeChinaUrl(detailUrl: string): string {
  if (detailUrl.length > MAX_URL_LENGTH) throw new Error('URL too long');
  if (detailUrl.startsWith('/')) return `${CHINA_BASE_URL}${detailUrl}`;
  const parsed = new URL(detailUrl);
  if (parsed.origin !== CHINA_BASE_URL || parsed.protocol !== 'https:') {
    throw new Error('Unexpected domain');
  }
  return parsed.toString();
}

// Для japan/korea: возвращаем относительный путь вида /korea/... или /japan/...
function normalizePriorityDetailUrl(detailUrl: string | undefined, country: string): string | undefined {
  if (!detailUrl) return undefined;
  if (detailUrl.length > MAX_URL_LENGTH) throw new Error('URL too long');

  if (detailUrl.startsWith('/korea/') || detailUrl.startsWith('/japan/')) {
    return detailUrl;
  }

  const base = PRIORITY_BASES[country];
  if (base && detailUrl.startsWith(base)) {
    const suffix = detailUrl.substring(base.length);
    return `/${country}/${suffix}`;
  }

  throw new Error('Unexpected detail URL');
}
