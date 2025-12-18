import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import apiRoutes from './routes/apiRoutes';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', apiRoutes);

// Routes Placeholder
app.get('/', (req: Request, res: Response) => {
    res.send('Smart Telemedicine API is Running');
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

export default app;
