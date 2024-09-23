"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitPaymentSuccess = exports.initializeSocket = void 0;
let io; // Reference to the Socket.IO instance
// Initialize Socket.IO and set up event listeners
const initializeSocket = (socketIo) => {
    io = socketIo;
    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);
        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
        // Example of listening for a custom event
        socket.on('paymentSuccess', (data) => {
            console.log('Payment success data received:', data);
            // You can emit events to other clients or process the data
        });
    });
};
exports.initializeSocket = initializeSocket;
// Function to emit events to clients from other parts of the app
const emitPaymentSuccess = (userId, data) => {
    if (io) {
        io.to(userId).emit('paymentSuccess', data);
    }
    else {
        console.error('Socket.io is not initialized');
    }
};
exports.emitPaymentSuccess = emitPaymentSuccess;
