"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const prisma = new client_1.PrismaClient();
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
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
        const salt = await bcrypt_1.default.genSalt(10);
        const passwordHash = await bcrypt_1.default.hash(password, salt);
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
                });
            }
            else if (user.role === 'PATIENT') {
                await prisma.patientProfile.create({
                    data: {
                        userId: user.id
                    }
                });
            }
            res.status(201).json({
                id: user.id,
                email: user.email,
                role: user.role,
                token: (0, generateToken_1.default)(user.id, user.role),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        console.error(error);
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.registerUser = registerUser;
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    console.log('Login Body:', req.body);
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (user && (await bcrypt_1.default.compare(password, user.passwordHash))) {
            res.json({
                id: user.id,
                email: user.email,
                role: user.role,
                token: (0, generateToken_1.default)(user.id, user.role),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.loginUser = loginUser;
