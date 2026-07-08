// Full-page screenshot via Chrome DevTools Protocol (no deps)
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const net = require('net');

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = process.argv[2] || "http://localhost:3005/ideal2";
const OUT = process.argv[3] || "C:\\Users\\Pasha\\AppData\\Local\\Temp\\opencode\\cdp.png";
const WIDTH = parseInt(process.argv[4] || "1280", 10);
const PORT = 9222;

function get(path) {
  return new Promise((res, rej) => {
    http.get({ host: '127.0.0.1', port: PORT, path }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(d));
    }).on('error', rej);
  });
}

async function waitPort() {
  for (let i = 0; i < 40; i++) {
    const ok = await new Promise(r => {
      const s = net.connect(PORT, '127.0.0.1');
      s.on('connect', () => { s.destroy(); r(true); });
      s.on('error', () => r(false));
    });
    if (ok) return;
    await new Promise(r => setTimeout(r, 250));
  }
  throw new Error('devtools port not up');
}

(async () => {
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    `--remote-debugging-port=${PORT}`, `--window-size=${WIDTH},2000`,
    '--user-data-dir=' + require('os').tmpdir() + '\\cdpprofile' + Date.now(),
    'about:blank'
  ]);
  chrome.stderr.on('data', () => {});
  await waitPort();

  const list = JSON.parse(await get('/json'));
  let target = list.find(t => t.type === 'page');
  const wsUrl = target.webSocketDebuggerUrl;

  const WebSocket = require(fs.existsSync(process.cwd()+'/node_modules/ws') ? 'ws' : require.resolve('ws', { paths: ['E:/work/sites/orient/orientavto.com/node_modules'] }));
  const ws = new WebSocket(wsUrl);
  let id = 0; const pending = {};
  const send = (method, params={}) => new Promise((res) => { const i=++id; pending[i]={res}; ws.send(JSON.stringify({id:i,method,params})); });
  ws.on('message', m => { const o = JSON.parse(m); if (o.id && pending[o.id]) { pending[o.id].res(o.result); delete pending[o.id]; } });
  await new Promise(r => ws.on('open', r));

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: 2000, deviceScaleFactor: 1, mobile: WIDTH < 500 });
  await send('Page.navigate', { url: URL });
  await new Promise(r => setTimeout(r, 6000));
  // scroll through to trigger lazy/whileInView
  await send('Runtime.evaluate', { expression: `(async()=>{const h=document.body.scrollHeight;for(let y=0;y<h;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,220));}window.scrollTo(0,0);})()`, awaitPromise: true });
  await new Promise(r => setTimeout(r, 1200));
  // force any still-hidden reveal elements visible (framer whileInView safety)
  await send('Runtime.evaluate', { expression: `document.querySelectorAll('*').forEach(el=>{const s=getComputedStyle(el);if(parseFloat(s.opacity)<0.99){el.style.opacity='1';el.style.transform='none';}});` });
  await new Promise(r => setTimeout(r, 400));

  const metrics = await send('Page.getLayoutMetrics');
  const h = Math.ceil(metrics.cssContentSize.height);
  const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x:0, y:0, width: WIDTH, height: h, scale: 1 } });
  fs.writeFileSync(OUT, Buffer.from(data, 'base64'));
  console.log('WROTE', OUT, h);
  ws.close(); chrome.kill();
  process.exit(0);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
