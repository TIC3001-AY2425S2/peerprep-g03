import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import questionRoutes from './routes/questions.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

if(process.env.NODE_ENV === 'ci'){
    console.log("MongoDB with Github Actions!");
    mongoose.connect('mongodb://localhost:27117/test-db');
}else if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
}

app.use('/api/questions', questionRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
