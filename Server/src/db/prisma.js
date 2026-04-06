import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || 
new PrismaClient({
    log: ['query', 'warn', 'error'],
})

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

const connectPrisma = async () => {
    try {
        await prisma.$connect();
        console.log('Connected to Prisma');
    } catch (error) {
        console.error('Error connecting to Prisma:', error);
        process.exit(1);
    }
}

export { prisma, connectPrisma };