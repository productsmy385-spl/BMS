// API routes call this helper. The custom server attaches the Socket.IO server to globalThis.
import type { Server as SocketServer } from 'socket.io';
type RealtimeGlobal = typeof globalThis & { io?: SocketServer };
export function broadcast(event: string, payload: unknown) {
  (globalThis as RealtimeGlobal).io?.emit(event, payload);
}
