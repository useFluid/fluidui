import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";

const root = path.resolve(process.argv[2] ?? "apps/site/out");
const port = Number(process.env.PORT ?? 3200);
const host = process.env.HOST ?? "127.0.0.1";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

const send = (res, status, file) => {
  res.writeHead(status, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
};

createServer((req, res) => {
  const url = new URL(req.url, `http://${host}`);
  const pathname = decodeURIComponent(url.pathname);
  const file = path.join(root, pathname);
  if (!file.startsWith(root)) return send(res, 404, path.join(root, "404.html"));
  if (existsSync(file) && statSync(file).isFile()) return send(res, 200, file);
  if (existsSync(path.join(file, "index.html"))) {
    if (!pathname.endsWith("/")) {
      res.writeHead(301, { location: `${pathname}/${url.search}` });
      return res.end();
    }
    return send(res, 200, path.join(file, "index.html"));
  }
  send(res, 404, path.join(root, "404.html"));
}).listen(port, host, () => console.log(`Serving ${root} at http://${host}:${port}`));
