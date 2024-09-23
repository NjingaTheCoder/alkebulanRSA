import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';

let io: SocketIOServer | undefined; // Reference to the Socket.IO instance

// Initialize Socket.IO and set up event listeners
export const initializeSocket = (socketIo: SocketIOServer) => {
  io = socketIo;

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Example of listening for a custom event
    socket.on('paymentSuccess', (data: any) => { // Adjust `any` to the specific type of `data` if known
      console.log('Payment success data received:', data);
      // You can emit events to other clients or process the data
    });
  });
};

// Function to emit events to clients from other parts of the app
export const emitPaymentSuccess = (userId: string, data: unknown) => { // Adjust `any` to the specific type of `data` if known
  if (io) {
    io.to(userId).emit('paymentSuccess', data);
  } else {
    console.error('Socket.io is not initialized');
  }
};
