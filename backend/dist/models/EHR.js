"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ehrSchema = new mongoose_1.default.Schema({
    patientId: {
        type: String,
        required: true,
    },
    doctorId: {
        type: String,
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    prescription: [
        {
            medicine: String,
            dosage: String,
            duration: String,
        },
    ],
    notes: {
        type: String,
    },
    attachments: [
        {
            fileName: String,
            fileUrl: String, // In a real app, this would be AWS S3 URL
        },
    ],
}, {
    timestamps: true,
});
const EHR = mongoose_1.default.model('EHR', ehrSchema);
exports.default = EHR;
