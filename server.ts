import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { createProxyMiddleware } from 'http-proxy-middleware';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);

    // Proxy API requests
    if (parsedUrl.pathname!.startsWith('/api')) {
      createProxyMiddleware({
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      })(req, res, () => {});
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(3000, (err?: Error) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
}); 