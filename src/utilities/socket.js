import io from 'socket.io-client';

const SOCKET_URL = 'wss://backend.fomino.ch:3041';

export const createSocketConnection = (userId) => {
  const socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('Connected');
    const map = {
      userId, // Use the actual userId
      type: 'connected',
    };
    socket.emit('message', JSON.stringify(map));
  });

  socket.on('placeOrder', (data) => {
    console.log(data);
    // Handle the received data
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });

  socket.on('error', (error) => {
    console.error('Error:', error);
  });

  return socket;
};
