import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../services/notificationService';
import crypto from 'crypto';

const prisma = new PrismaClient();

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Patient)
export const bookAppointment = async (req: Request, res: Response) => {
    const { doctorId, date, timeSlot } = req.body;
    const patientId = req.user?.id;

    if (!patientId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }

    try {
        const meetingId = crypto.randomUUID();
        // Basic overlap check omitted for brevity
        const appointment = await prisma.appointment.create({
            data: {
                patientId,
                doctorId,
                date: new Date(date), // Simplification
                status: 'PENDING',
                meetingLink: meetingId
            }
        });

        // Notify Doctor (Mocking doctor email fetch)
        await sendEmail('doctor@example.com', 'New Appointment Recommendation', `Patient has booked a slot on ${date}`);

        // Real-time update
        const io = req.app.get('io');
        if (io) {
            io.emit('new-appointment', {
                doctorId,
                patientId,
                date,
                message: 'New appointment booked'
            });
        }

        res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const role = req.user?.role;

    try {
        let appointments;
        if (role === 'DOCTOR') {
            appointments = await prisma.appointment.findMany({
                where: { doctorId: userId },
                include: { patient: { select: { firstName: true, lastName: true } } }
            });
        } else {
            appointments = await prisma.appointment.findMany({
                where: { patientId: userId },
                include: { doctor: { select: { firstName: true, lastName: true } } }
            });
        }
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

// @desc    Approve an appointment
// @route   PUT /api/appointments/:id/approve
// @access  Private (Doctor)
export const approveAppointment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const doctorId = req.user?.id;

    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id },
            include: {
                patient: {
                    select: { id: true, firstName: true, email: true }
                }
            }
        });

        if (!appointment) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }

        if (appointment.doctorId !== doctorId) {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: { status: 'CONFIRMED' }
        });

        // Notify Patient via Socket
        const io = req.app.get('io');
        if (io) {
            console.log("Emitting appointment-approved for appointment:", id);
            io.emit('appointment-approved', {
                appointmentId: id,
                patientId: appointment.patientId,
                status: 'CONFIRMED',
                message: `Your appointment with your doctor is confirmed!`
            });
        }

        // Send Email (Mock)
        await sendEmail(appointment.patient?.email || 'patient@example.com', 'Appointment Confirmed', 'Your appointment has been confirmed.');

        res.json(updatedAppointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
