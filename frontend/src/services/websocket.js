import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let client = null;

export const connectWebSocket = (onMessageReceived) => {
  const url = process.env.REACT_APP_WS_URL || 'http://localhost:8080/ws';
  client = new Client({
    webSocketFactory: () => new SockJS(url),
    onConnect: () => {
      console.log('✅ WebSocket connected');
      client.subscribe('/topic/availability', (message) => {
        const bookedTimes = JSON.parse(message.body);
        onMessageReceived(bookedTimes);
      });
    },
    onStompError: (frame) => {
      console.error('❌ WebSocket error', frame);
    },
  });
  client.activate();
};

export const disconnectWebSocket = () => {
  if (client) client.deactivate();
};