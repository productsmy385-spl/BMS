import { createServer } from 'node:http';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = Number(process.env.PORT || 3000);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  const httpServer = createServer((req, res) => handle(req, res));
  const io = new SocketIOServer(httpServer, { cors: { origin: process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${port}` } });
  (globalThis as typeof globalThis & { io?: SocketIOServer }).io = io;
  io.on('connection', socket => { socket.emit('realtime:connected', { ok: true, at: new Date().toISOString() }); });
  httpServer.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use. Run 'Stop-Process -Id (Get-NetTCPConnection -LocalPort ${port}).OwningProcess -Force' or start with PORT=${port + 1}`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
  httpServer.listen(port, hostname, () => console.log(`🚀 BMS server listening on http://${hostname}:${port}`));
});

