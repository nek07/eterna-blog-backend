import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

// import { postsRouter } from './routes/posts.js';
import { prisma } from './config/prismaClient.js';
import { postsRouter } from './routes/posts.js';
import { auth } from './middlewares/auth.js';
import { authRouter } from './routes/auth.js';
dotenv.config();

const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/auth', authRouter);
  
// health-check: проверяем соединение с PG
app.get('/health', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.send('ok');
});
// src/app.js (после app.use('/posts', postsRouter))
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
  });
  


app.use('/posts', postsRouter);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀  API ready on http://localhost:${PORT}`);
});