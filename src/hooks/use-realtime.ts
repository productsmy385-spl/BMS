'use client';
import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
let sharedSocket: Socket | undefined;
export function useRealtime<T>(event: string, onEvent: (payload: T) => void) {
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    sharedSocket ??= io(url, { transports: ['websocket', 'polling'], autoConnect: true });
    const socket = sharedSocket;
    const connect = () => setConnected(true); const disconnect = () => setConnected(false);
    socket.on('connect', connect); socket.on('disconnect', disconnect); socket.on(event, onEvent);
    setConnected(socket.connected);
    return () => { socket.off('connect', connect); socket.off('disconnect', disconnect); socket.off(event, onEvent); };
  }, [event, onEvent]);
  return { connected };
}
