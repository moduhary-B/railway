import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { logger } from "@/lib/logger";

const MAX_JSON_BYTES = 8 * 1024;
const MAX_STRING_LEN = 200;
const VALID_COUNTRIES = ["japan", "korea", "china"];

function mapSortParameter(sort?: string | null): string | undefined {
  if (!sort) return undefined;
  const map: Record<string, string> = {
    price_asc: "PRICE--ASC",
    price_desc: "PRICE--DESC",
    year_asc: "YEAR--ASC",
    year_desc: "YEAR--DESC",
    mileage_asc: "MILEAGE--ASC",
    mileage_desc: "MILEAGE--DESC",
  };
  return map[sort];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ country: string }> }
) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const { country } = await params;

  try {
    logger.apiRequest("GET", `/api/cars/${country}`, {
      country,
      searchParams: Object.fromEntries(searchParams.entries()),
    });

    logger.info(`Начало обработки запроса для страны: ${country}`, "api", {
      country,
      searchParams: Object.fromEntries(searchParams.entries()),
    });

    if (!VALID_COUNTRIES.includes(country)) {
      logger.error(`Неверная страна: ${country}`, "api", { country });
      return NextResponse.json({ error: "Invalid country" }, { status: 400 });
    }

    const filterParams = {
      marka: safeStr(searchParams.get("brand")),
      model: safeStr(searchParams.get("model")),
      year_from: safeInt(searchParams.get("yearMin"), 1900, 2100),
      year_to: safeInt(searchParams.get("yearMax"), 1900, 2100),
      price_from: safeInt(searchParams.get("priceMin"), 0, 50_000_000),
      price_to: safeInt(searchParams.get("priceMax"), 0, 50_000_000),
      mileage_from: safeInt(searchParams.get("mileageMin"), 0, 2_000_000),
      mileage_to: safeInt(searchParams.get("mileageMax"), 0, 2_000_000),
      eng_v_from: safeInt(searchParams.get("engineVolumeMin"), 0, 10_000),
      eng_v_to: safeInt(searchParams.get("engineVolumeMax"), 0, 10_000),
      power_from: safeInt(searchParams.get("powerMin"), 0, 2000),
      power_to: safeInt(searchParams.get("powerMax"), 0, 2000),
      kuzov_manual: safeStr(searchParams.get("bodyType")),
      rate: safeStr(searchParams.get("rate")),
      sort: mapSortParameter(searchParams.get("sort")),
      // page оставляем без clamp по вашему требованию
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
    } as Record<string, any>;

    const cleanParams = Object.fromEntries(
      Object.entries(filterParams).filter(([, v]) => v !== undefined)
    );
    const payload = JSON.stringify(cleanParams);
    if (Buffer.byteLength(payload) > MAX_JSON_BYTES) {
      return NextResponse.json(
        { error: "Request parameters too large" },
        { status: 400 }
      );
    }

    let parserPath: string;
    let parserDir: string;
    switch (country) {
      case "japan":
        parserDir = "/var/www/auto-pars/japan";
        parserPath = path.join(parserDir, "J-priority-auto.py");
        break;
      case "korea":
        parserDir = "/var/www/auto-pars/korea";
        parserPath = path.join(parserDir, "K-priority-auto.py");
        break;
      case "china":
        parserDir = "/var/www/auto-pars/new.worldcar-ru";
        parserPath = path.join(parserDir, "china-catalog.py");
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported country" },
          { status: 400 }
        );
    }

    if (!fs.existsSync(parserPath)) {
      return NextResponse.json({ error: "Parser not found" }, { status: 500 });
    }

    const result = await runParser(parserPath, parserDir, cleanParams, country);
    const duration = Date.now() - startTime;

    const pageSize =
      country === "japan"
        ? 60
        : country === "korea"
        ? 24
        : country === "china"
        ? 20
        : 24;

    return NextResponse.json({
      success: true,
      data: result.cars,
      total: result.totalCount,
      pageSize,
      totalPages: Math.ceil(result.totalCount / pageSize),
      filters: filterParams,
      duration,
      country,
      parserUrl: result.parserUrl,
      parserInfo: {
        path: parserPath,
        directory: parserDir,
        baseUrl: getBaseUrl(country),
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        duration,
      },
      { status: 500 }
    );
  }
}

function getBaseUrl(country: string): string {
  switch (country) {
    case "japan":
      return "https://priority-auto.ru/auto-from-japan/";
    case "korea":
      return "https://priority-auto.ru/auto-from-korea/";
    case "china":
      return "https://new.worldcar.ru/china-used/";
    default:
      return "";
  }
}

function safeStr(value: string | null, maxLen: number = MAX_STRING_LEN): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, maxLen);
}

function safeInt(value: string | null, min: number, max: number): number | undefined {
  if (!value) return undefined;
  const num = parseInt(value, 10);
  if (Number.isNaN(num)) return undefined;
  if (num < min || num > max) return undefined;
  return num;
}

async function runParser(
  parserPath: string,
  parserDir: string,
  params: any,
  country: string
): Promise<{ cars: any[]; parserUrl: string; totalCount: number }> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined)
    );

    const pythonProcess = spawn("python3", [parserPath], {
      cwd: parserDir,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let output = "";
    let errorOutput = "";
    let parserUrl = "";

    pythonProcess.stdin.write(JSON.stringify(cleanParams));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on("data", (data) => {
      const chunk = data.toString();
      output += chunk;
      const urlMatch = chunk.match(/Сформированная ссылка: (.+)/);
      if (urlMatch) parserUrl = urlMatch[1];
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        try {
          let cleanOutput = output;
          const jsonStartIndex = output.indexOf("{");
          if (jsonStartIndex !== -1) cleanOutput = output.substring(jsonStartIndex);
          const parserResult = JSON.parse(cleanOutput);

          let totalCount = parserResult.total_count || 0;
          if (totalCount === 0 && parserResult.results && Array.isArray(parserResult.results)) {
            totalCount = parserResult.results.length;
          }

          let cars: any[] = [];
          if (parserResult.results && Array.isArray(parserResult.results)) cars = parserResult.results;
          else if (Array.isArray(parserResult)) cars = parserResult;

          const transformedCars = cars.map((car: any, index: number) => {
            const transformedCar: any = {
              id: car.lot || car.id || `${country}-${index}`,
              name:
                (car.name || `${car.brand || "Unknown"} ${car.model || ""}`.trim()) +
                (car.complectation ? ` ${car.complectation}` : ""),
              brand: car.brand,
              model: car.model,
              price: car.price || car.price_val,
              mileage: car.mileage || car.mileage_val,
              engineVolume: car.engine_volume || car.volume_val,
              fuelType: car.eng_type || car.fuel_type,
              transmission: car.kpp_type || car.transmission,
              bodyType: car.body || car.body_val,
              color: car.color,
              location: country,
              images: car.photos || car.images || car.photo || [],
              rating: car.rating,
              isHit: car.isHit,
              isNew: car.isNew,
              creditFrom: car.creditFrom,
              url: car.detail_url || car.url,
              power: car.power || car.power_val,
              drive: car.drive || car.drive_val,
              complectation: car.complectation,
              rate: car.rate,
              auctionDate: car.auction_date,
              sanctions: car.sanctions,
              serv: car.serv,
            };
            if (car.year) transformedCar.year = car.year;
            Object.keys(transformedCar).forEach((key) => {
              if (transformedCar[key] === undefined || transformedCar[key] === null) {
                delete transformedCar[key];
              }
            });
            return transformedCar;
          });

          resolve({
            cars: transformedCars,
            parserUrl: parserUrl || "URL не найден в выводе парсера",
            totalCount,
          });
        } catch (err) {
          reject(new Error(`Failed to parse parser output: ${err}`));
        }
      } else {
        reject(new Error(`Parser failed with code ${code}: ${errorOutput}`));
      }
    });

    pythonProcess.on("error", (error) => {
      reject(error);
    });

    setTimeout(() => {
      pythonProcess.kill();
      reject(new Error("Parser timeout"));
    }, 60000);
  });
}
