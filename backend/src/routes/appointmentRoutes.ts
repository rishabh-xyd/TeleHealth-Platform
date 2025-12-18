import express from 'express';
import { bookAppointment, getAppointments, approveAppointment } from '../controllers/appointmentController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.use(protect); // Protect all routes

router.put('/:id/approve', approveAppointment);

router.route('/')
    .get(getAppointments)
    .post(bookAppointment);

export default router;
