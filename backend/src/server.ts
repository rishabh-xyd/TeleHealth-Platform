

import app from './app';
import http from 'http';
import { configureSocket } from './socket';

const server = http.createServer(app);
const io = configureSocket(server);

app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`DATABASE_URL loaded:${process.env.DATABASE_URL}`);
    console.log("Socket.io attached? Listeners for 'request':", server.listeners('request').length);
    console.log("Socket.io attached? Listeners for 'upgrade':", server.listeners('upgrade').length);
});
