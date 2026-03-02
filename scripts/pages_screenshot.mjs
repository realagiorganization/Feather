#!/usr/bin/env node
import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { chromium } from 'playwright';

const DEFAULT_URL = 'https://realagiorganization.github.io/Feather/';
const docsRoot = path.resolve('docs');
const targetUrl = process.env.PAGES_URL || DEFAULT_URL;
const outputPath = process.env.SCREENSHOT_PATH || 'Images/github-pages-latest.png';
const fallbackPort = Number(process.env.LOCAL_PORT || 4177);

const contentType = (filePath) => {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.gif')) return 'image/gif';
  if (filePath.endsWith('.svg')) return 'image/svg+xml';
  if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
  return 'text/plain; charset=utf-8';
};

async function reachable(url) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    return res.ok;
  } catch (error) {
    console.warn(`Warning: could not reach ${url}: ${error.message}`);
    return false;
  }
}

async function startDocsServer(port) {
  const server = createServer(async (req, res) => {
    const requestPath = req.url?.split('?')[0] || '/';
    const relative = requestPath === '/' ? 'index.html' : requestPath.replace(/^\//, '');
    const resolved = path.resolve(docsRoot, relative);
    if (!resolved.startsWith(docsRoot)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    const filePath = resolved;

    try {
      const fileStat = await stat(filePath);
      if (fileStat.isDirectory()) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      const data = await readFile(filePath);
      res.writeHead(200, { 'content-type': contentType(filePath) });
      res.end(data);
    } catch (error) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    }
  });

  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  console.log(`Fallback docs server running at http://127.0.0.1:${port}`);
  return server;
}

async function capture(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: outputPath, fullPage: true });
  await browser.close();
  console.log(`Screenshot saved to ${outputPath}`);
}

async function main() {
  const useRemote = await reachable(targetUrl);
  let server;
  let visit = targetUrl;

  if (!useRemote) {
    server = await startDocsServer(fallbackPort);
    visit = `http://127.0.0.1:${fallbackPort}`;
    console.log(`Remote page unavailable, using local docs fallback at ${visit}`);
  } else {
    console.log(`Remote page reachable, capturing ${targetUrl}`);
  }

  try {
    await capture(visit);
  } finally {
    server?.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
