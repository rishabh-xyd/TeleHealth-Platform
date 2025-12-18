import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to connect to database...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL);
        await prisma.$connect();
        console.log('Successfully connected to the database!');
        const userCount = await prisma.user.count();
        console.log(`Current user count: ${userCount}`);
    } catch (error) {
        console.error('Failed to connect to the database:');
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
