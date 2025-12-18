import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get Admin Stats
// @route   GET /api/stats/admin
// @access  Private (Admin)
export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalDoctors = await prisma.user.count({ where: { role: 'DOCTOR' } });
        const totalPatients = await prisma.user.count({ where: { role: 'PATIENT' } });
        const verifiedDoctors = await prisma.doctorProfile.count({ where: { isVerified: true } });
        const pendingDoctors = await prisma.doctorProfile.count({ where: { isVerified: false } });

        // Get recent unverified doctors
        const pendingVerifications = await prisma.user.findMany({
            where: {
                role: 'DOCTOR',
                doctorProfile: { isVerified: false }
            },
            include: { doctorProfile: true },
            take: 5
        });

        res.json({
            totalUsers,
            totalDoctors,
            totalPatients,
            verifiedDoctors,
            pendingDoctors,
            pendingVerifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Doctor Stats
// @route   GET /api/stats/doctor
// @access  Private (Doctor)
export const getDoctorStats = async (req: Request, res: Response) => {
    const doctorId = req.user?.id;

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const totalAppointments = await prisma.appointment.count({
            where: { doctorId }
        });

        const todayAppointmentsCount = await prisma.appointment.count({
            where: {
                doctorId,
                date: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });

        const distinctPatients = await prisma.appointment.findMany({
            where: { doctorId },
            distinct: ['patientId'],
            select: { patientId: true }
        });

        // Get today's appointments details
        const todaysAppointments = await prisma.appointment.findMany({
            where: {
                doctorId,
                date: {
                    gte: today,
                    lt: tomorrow
                }
            },
            include: {
                patient: {
                    select: { firstName: true, lastName: true, email: true }
                }
            },
            orderBy: { date: 'asc' }
        });

        res.json({
            totalPatients: distinctPatients.length,
            todayAppointments: todayAppointmentsCount,
            totalConsultations: totalAppointments, // Assume all past appointments are consultations for now
            todaysSchedule: todaysAppointments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
