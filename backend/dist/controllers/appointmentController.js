"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppointments = exports.bookAppointment = void 0;
const client_1 = require("@prisma/client");
const notificationService_1 = require("../services/notificationService");
const prisma = new client_1.PrismaClient();
// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = async (req, res) => {
    const { doctorId, date, timeSlot } = req.body;
    const patientId = req.user?.id;
    if (!patientId) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
    }
    try {
        // Basic overlap check omitted for brevity
        const appointment = await prisma.appointment.create({
            data: {
                patientId,
                doctorId,
                date: new Date(date), // Simplification
                status: 'PENDING'
            }
        });
        // Notify Doctor (Mocking doctor email fetch)
        await (0, notificationService_1.sendEmail)('doctor@example.com', 'New Appointment Recommendation', `Patient has booked a slot on ${date}`);
        res.status(201).json(appointment);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.bookAppointment = bookAppointment;
// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
    const userId = req.user?.id;
    const role = req.user?.role;
    try {
        let appointments;
        if (role === 'DOCTOR') {
            appointments = await prisma.appointment.findMany({
                where: { doctorId: userId },
                include: { patient: { select: { firstName: true, lastName: true } } }
            });
        }
        else {
            appointments = await prisma.appointment.findMany({
                where: { patientId: userId },
                include: { doctor: { select: { firstName: true, lastName: true } } }
            });
        }
        res.json(appointments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getAppointments = getAppointments;
