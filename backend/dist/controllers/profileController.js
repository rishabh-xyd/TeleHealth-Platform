"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getProfile = getProfile;
// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
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
        }
        else {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.updateProfile = updateProfile;
