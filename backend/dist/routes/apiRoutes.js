"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ehrController_1 = require("../controllers/ehrController");
const profileController_1 = require("../controllers/profileController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.use(authMiddleware_1.protect);
// Profile
router.get('/profile', profileController_1.getProfile);
router.put('/profile', profileController_1.updateProfile);
// EHR
router.post('/ehr', ehrController_1.createEHR);
router.get('/ehr/:patientId', ehrController_1.getEHRs);
exports.default = router;
