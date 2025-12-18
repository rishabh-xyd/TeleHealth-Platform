import { Request, Response } from 'express';
import EHR from '../models/EHR';

// @desc    Create new EHR record
// @route   POST /api/ehr
// @access  Private (Doctor only)
export const createEHR = async (req: Request, res: Response) => {
    try {
        const { patientId, diagnosis, prescription, notes } = req.body;
        const doctorId = req.user?.id;

        if (req.user?.role !== 'DOCTOR') {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        const ehr = await EHR.create({
            patientId,
            doctorId,
            diagnosis,
            prescription,
            notes,
        });

        res.status(201).json(ehr);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get EHR records for a patient
// @route   GET /api/ehr/:patientId
// @access  Private
export const getEHRs = async (req: Request, res: Response) => {
    try {
        const records = await EHR.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
        res.json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
