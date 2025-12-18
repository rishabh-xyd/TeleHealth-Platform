import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken';

const prisma = new PrismaClient();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response) => {
    console.log('Register Body:', req.body);
    const { email, password, firstName, lastName, role } = req.body;

    try {
        const userExists = await prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName,
                lastName,
                role: role || 'PATIENT',
            },
        });

        if (user) {
            // Create associated profile based on role
            if (user.role === 'DOCTOR') {
                await prisma.doctorProfile.create({
                    data: {
                        userId: user.id,
                        specialization: 'General',
                        experienceYears: 0,
                        consultationFee: 0
                    }
                })
            } else if (user.role === 'PATIENT') {
                await prisma.patientProfile.create({
                    data: {
                        userId: user.id
                    }
                })
            }

            const io = req.app.get('io');
            if (io) {
                console.log("Socket instance found, emitting events...");
                // Generic new user event for Admin Stats (Total Users)
                io.emit('new-user', { role: user.role });

                if (user.role === 'DOCTOR') {
                    console.log(`Emitting new-doctor-registration for ${user.email}`);
                    io.emit('new-doctor-registration', {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        doctorProfile: { specialization: 'General', isVerified: false }, // Basic info
                        createdAt: new Date().toISOString()
                    });
                }
            } else {
                console.error("Socket instance NOT found in req.app");
            }

            res.status(201).json({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        console.error(error);
        res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response) => {
    console.log('Login Body:', req.body);
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            res.json({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Server error: ${(error as Error).message}`, error: (error as Error).message });
    }
};
