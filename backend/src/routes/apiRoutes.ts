import express from 'express';
import { createEHR, getEHRs } from '../controllers/ehrController';
import { getProfile, updateProfile, getAllDoctors, verifyDoctor, getUnverifiedDoctors, rejectDoctor } from '../controllers/profileController';
import { getAdminStats, getDoctorStats } from '../controllers/statsController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect);

// Stats
router.get('/stats/admin', getAdminStats);
router.get('/stats/doctor', getDoctorStats);

// Doctors
router.get('/doctors', getAllDoctors);
router.get('/doctors/pending', getUnverifiedDoctors);
router.put('/doctors/:id/verify', verifyDoctor);
router.put('/doctors/:id/reject', rejectDoctor);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// EHR
router.post('/ehr', createEHR);
router.get('/ehr/:patientId', getEHRs);

export default router;
