'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useCustomToast } from '@/hooks/useCustomToast';

interface WebSocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connected: false
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const toast = useCustomToast();
  const [token, setToken] = useState<string | null>(null);

  // Check for token changes
  useEffect(() => {
    const checkToken = () => {
      const currentToken = localStorage.getItem('token');
      setToken(currentToken);
    };

    // Check immediately
    checkToken();

    // Set up storage event listener
    window.addEventListener('storage', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, []);

  useEffect(() => {
    if (!token) {
      console.log('No token available, waiting for login...');
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
    
    console.log('Starting WebSocket connection setup:', {
      wsUrl,
      hasToken: !!token
    });
    
    const socket = io(wsUrl!, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket', 'polling']
    });

    socket.onAny((eventName, ...args) => {
      console.log('Socket event:', eventName, args);
    });

    socket.on('connect', () => {
      console.log('Socket connected, socket id:', socket.id);
      console.log('Sending authentication token...');
      socket.emit('authenticate', token);
    });

    socket.on('authenticated', (response) => {
      console.log('Authentication response:', response);
      if (response.success) {
        setConnected(true);
        toast.success('Real-time connection established');
        
        // Send a test message
        socket.emit('test_message', { message: 'Hello server!' });
      } else {
        console.error('Authentication failed:', response.error);
        toast.error('Failed to authenticate real-time connection');
        socket.disconnect();
      }
    });

    socket.on('test_response', (data) => {
      console.log('Received test response:', data);
      toast.success('Received test message from server!');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', {
        message: error.message,
        description: error.description,
        type: error.type
      });
      setConnected(false);
      toast.error(`Connection error: ${error.message}`);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setConnected(false);
      if (reason !== 'io client disconnect') {
        toast.error(`Connection lost: ${reason}`);
      }
    });

    console.log('Attempting socket connection...');
    socket.connect();
    setSocket(socket);

    return () => {
      console.log('Cleaning up socket connection...');
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [token]); // Depend on token changes

  return (
    <WebSocketContext.Provider value={{ socket, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext); 