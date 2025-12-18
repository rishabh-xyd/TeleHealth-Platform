import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const configureSocket = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
            methods: ['GET', 'POST'],
            credentials: true
        },
    });
    console.log("Socket.io initialized with CORS allowed for localhost:3000");

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

        // WebRTC Signaling
        socket.on('call-user', ({ userToCall, signalData, from, name }) => {
            io.to(userToCall).emit('call-user', { signal: signalData, from, name });
        });

        socket.on('answer-call', (data) => {
            io.to(data.to).emit('call-accepted', data.signal);
        });

        socket.on('ice-candidate', ({ target, candidate }) => {
            io.to(target).emit('ice-candidate', candidate);
        });
    });

    return io;
};
