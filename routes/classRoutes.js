const express = require('express');
const router = express.Router();
const Class = require('../models/Class');
const { protectAdmin } = require('../middleware/authMiddleware');

// [READ - Public] Active Classes පමණක් ලබා ගැනීම
// GET /api/classes
router.get('/', async (req, res) => {
  try {
    const classes = await Class.find({ isActive: true }).sort({ batchYear: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// [READ - Admin] Inactive ඒවා ඇතුළුව සියලුම Classes බැලීම (Dashboard එක සඳහා)
// GET /api/classes/admin/all
router.get('/admin/all', protectAdmin, async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// [READ - Single] තනි Class එකක විස්තර බැලීම
// GET /api/classes/:id
router.get('/:id', async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(classItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// [CREATE - Admin] අලුත් Class එකක් එකතු කිරීම
// POST /api/classes
router.post('/', protectAdmin, async (req, res) => {
  try {
    const newClass = new Class(req.body);
    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// [UPDATE - Admin] පවතින Class එකක් Update කිරීම
// PUT /api/classes/:id
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// [DELETE - Admin] Class එකක් Delete කිරීම
// DELETE /api/classes/:id
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;