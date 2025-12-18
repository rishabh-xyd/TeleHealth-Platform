"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSocket = void 0;
const socket_io_1 = require("socket.io");
const configureSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId);
            socket.to(roomId).emit('user-connected', userId);
            socket.on('disconnect', () => {
                socket.to(roomId).emit('user-disconnected', userId);
            });
        });
        socket.on('send-message', (data) => {
            io.to(data.roomId).emit('receive-message', data);
        });
    });
    return io;
};
exports.configureSocket = configureSocket;
