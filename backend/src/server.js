import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';

import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'

//To run the env file we need to import dotenv package and config it
dotenv.config();
// or simply we can do for dotenv
// import "dotenv/config"; If we do this we don't need to config it mannually

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json()); // this line helps to parse JSON request bodies
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
})
