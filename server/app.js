import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});