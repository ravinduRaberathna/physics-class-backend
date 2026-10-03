const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    batch: {
      type: String, // e.g. "2024 A/L", "2025 A/L"
      required: true,
    },
    school: {
      type: String, // e.g. "Ananda College", "Visakha Vidyalaya"
      default: '',
    },
    resultBadge: {
      type: String, // e.g. "Island 3rd - Colombo", "A Grade", "District 1st"
      default: 'Physics A',
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, // Student photo URL
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);