import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import robotRoutes from './routes/robotRoutes.js';
import errorRoutes from './routes/errorRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/robots', robotRoutes);
app.use('/api/errors', errorRoutes);
app.use('/api/jobs', jobRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});