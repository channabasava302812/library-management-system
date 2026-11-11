const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/books', require('./src/routes/bookRoutes'));
app.use('/api/issues', require('./src/routes/issueRoutes'));
app.use('/api/members', require('./src/routes/memberRoutes'));
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running successfully' });
});

// Port configuration
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});