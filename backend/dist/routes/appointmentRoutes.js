"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointmentController_1 = require("../controllers/appointmentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect); // Protect all routes
router.route('/')
    .get(appointmentController_1.getAppointments)
    .post(appointmentController_1.bookAppointment);
exports.default = router;
