import pkg from '@prisma/client'
const {PrismaClient}=pkg

export const prisma = new PrismaClient({
    log: [
      { level: 'error', emit: 'stdout' },
      { level: 'query', emit: 'stdout' }
    ],
  });
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
  });