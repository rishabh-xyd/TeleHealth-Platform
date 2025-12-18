import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                doctorProfile: true,
                patientProfile: true,
            },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { firstName, lastName, ...profileData } = req.body;

    try {
        // Update base user info
        await prisma.user.update({
            where: { id: userId },
            data: { firstName, lastName }
        });

        // Update specific profile based on role
        if (req.user?.role === 'DOCTOR') {
            await prisma.doctorProfile.update({
                where: { userId },
                data: {
                    specialization: profileData.specialization,
                    experienceYears: parseInt(profileData.experienceYears),
                    consultationFee: parseFloat(profileData.consultationFee),
                    bio: profileData.bio
                }
            });
        } else {
            await prisma.patientProfile.update({
                where: { userId },
                data: {
                    bloodGroup: profileData.bloodGroup,
                    address: profileData.address,
                    // gender and dob omitted for brevity in MVP
                }
            });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Private (Public in expanded app)
export const getAllDoctors = async (req: Request, res: Response) => {
    try {
        const doctors = await prisma.user.findMany({
            where: {
                role: 'DOCTOR',
                doctorProfile: {
                    isVerified: true
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                doctorProfile: true
            }
        });
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify a doctor profile
// @route   PUT /api/doctors/:id/verify
// @access  Private (Admin)
export const verifyDoctor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log("VERIFY DOCTOR HIT. ID:", id); // Verify code is running

        // Check if user is admin
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Not authorized as admin' });
            return;
        }

        await prisma.doctorProfile.update({
            where: { userId: id },
            data: { isVerified: true }
        });

        const io = req.app.get('io');
        console.log("IO Instance from app.get:", io ? "Found" : "Missing"); // Debug IO

        if (io) {
            console.log("Emitting doctor-verified event for", id);
            io.emit('doctor-verified', { id });
        } else {
            console.error("FATAL: IO instance NOT found in verifyDoctor. Check server.ts app.set('io')");
        }

        res.json({ message: 'Doctor verified successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all unverified doctors
// @route   GET /api/doctors/pending
// @access  Private (Admin)
export const getUnverifiedDoctors = async (req: Request, res: Response) => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        const doctors = await prisma.user.findMany({
            where: {
                role: 'DOCTOR',
                doctorProfile: {
                    isVerified: false
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                doctorProfile: true,
                createdAt: true
            }
        });
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reject/Remove a doctor with feedback
// @route   PUT /api/doctors/:id/reject
// @access  Private (Admin)
export const rejectDoctor = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'Not authorized as admin' });
            return;
        }

        if (!reason) {
            res.status(400).json({ message: 'Rejection reason is mandatory' });
            return;
        }

        await prisma.doctorProfile.update({
            where: { userId: id },
            data: {
                isVerified: false,
                rejectionReason: reason
            }
        });

        res.json({ message: 'Doctor rejected successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
