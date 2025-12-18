"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./socket");
const server = http_1.default.createServer(app_1.default);
const io = (0, socket_1.configureSocket)(server);
const PORT = process.env.PORT || 5000;
app_1.default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`DATABASE_URL loaded:${process.env.DATABASE_URL}`);
});
