const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes Mount කිරීම
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.get('/', (req, res) => {
  res.send('Physics Class Website API is running...');
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;