const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { protectAdmin } = require('../middleware/authMiddleware');

// 1. Public route - Active feedback පමණක් ලබාගැනීම (Auth අවශ්‍ය නැත)
router.get('/public', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching testimonials', error: error.message });
  }
});

// 2. Admin route - සියලුම feedbacks ලබාගැනීම
router.get('/', protectAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedbacks', error: error.message });
  }
});

// 3. Admin route - අලුත් feedback එකක් එක් කිරීම
router.post('/', protectAdmin, async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    const saved = await newFeedback.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error creating feedback', error: error.message });
  }
});

// 4. Admin route - Feedback එකක් update කිරීම
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const updated = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating feedback', error: error.message });
  }
});

// 5. Admin route - Feedback එකක් delete කිරීම
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feedback', error: error.message });
  }
});

module.exports = router;