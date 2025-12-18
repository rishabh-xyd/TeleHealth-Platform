"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
async function main() {
    try {
        console.log('Attempting to connect to database...');
        console.log('DATABASE_URL:', process.env.DATABASE_URL); // Be careful not to log sensitive info in prod
        // Simple query to test connection
        const userCount = await prisma.user.count();
        console.log(`Successfully connected! Found ${userCount} users.`);
        const admin = await prisma.user.findUnique({
            where: { email: 'admin@telehealth.com' }
        });
        if (admin) {
            console.log('Admin user found:', admin.id);
        }
        else {
            console.log('Admin user NOT found!');
        }
    }
    catch (error) {
        console.error('Connection failed:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
