"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEHRs = exports.createEHR = void 0;
const EHR_1 = __importDefault(require("../models/EHR"));
// @desc    Create new EHR record
// @route   POST /api/ehr
// @access  Private (Doctor only)
const createEHR = async (req, res) => {
    try {
        const { patientId, diagnosis, prescription, notes } = req.body;
        const doctorId = req.user?.id;
        if (req.user?.role !== 'DOCTOR') {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }
        const ehr = await EHR_1.default.create({
            patientId,
            doctorId,
            diagnosis,
            prescription,
            notes,
        });
        res.status(201).json(ehr);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.createEHR = createEHR;
// @desc    Get EHR records for a patient
// @route   GET /api/ehr/:patientId
// @access  Private
const getEHRs = async (req, res) => {
    try {
        const records = await EHR_1.default.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
        res.json(records);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getEHRs = getEHRs;
