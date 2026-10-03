const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { protectAdmin } = require('../middleware/authMiddleware');

// [CREATE - Public] ළමයින් විස්තර එවීම
// POST /api/inquiries
router.post('/', async (req, res) => {
  try {
    const newInquiry = new Inquiry(req.body);
    const savedInquiry = await newInquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully', data: savedInquiry });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// [READ ALL - Admin] සියලුම Inquiries බැලීම
// GET /api/inquiries
router.get('/', protectAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('classInterested', 'title batchYear type')
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// [READ ONE - Admin] තනි Inquiry එකක් බැලීම
// GET /api/inquiries/:id
router.get('/:id', protectAdmin, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id).populate('classInterested');
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// [UPDATE - Admin] Inquiry status වෙනස් කිරීම (Pending -> Contacted)
// PUT /api/inquiries/:id
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedInquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json(updatedInquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// [DELETE - Admin] Inquiry එකක් Delete කිරීම
// DELETE /api/inquiries/:id
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;