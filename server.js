const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.set('etag', false);

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Prevent stale HTTP caching across Vercel Edge & Client Browsers
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
});

// 1. Health check & Root routes (Zero DB overhead - Instant 2ms response for Cron-Job / Pings)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    uptime: Math.floor(process.uptime()), 
    timestamp: new Date().toISOString() 
  });
});

app.get('/', (req, res) => {
  res.send('Physics Class Website API is running...');
});

// 2. Ensure Database connection before handling data routes (Serverless safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

// 3. API Routes Mount
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// 4. Server listener (Runs for local dev, Render, or VPS. On Vercel, serverless handler is exported)
const PORT = process.env.PORT || 5000;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;