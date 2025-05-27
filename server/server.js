import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import problemRoutes from './routes/problems.js';
import topicRoutes from './routes/topics.js';
import userRoutes from './routes/users.js';
import runRoutes from './routes/run.js';
import submitRoutes from './routes/submit.js';
import aiRoutes from './routes/ai.js';
import contactRoutes from './routes/contact.js'

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT ;


app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/users', userRoutes);
app.use('/api/run', runRoutes);
app.use('/api/submit', submitRoutes);
app.use('/api/ai-help', aiRoutes);
app.use('/api/contact', contactRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('LeetCoder API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
