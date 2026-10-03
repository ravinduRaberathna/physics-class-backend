const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const { protectAdmin } = require('../middleware/authMiddleware');

// [READ - Public] සර්ගේ Profile එක බැලීම
// GET /api/teacher
router.get('/', async (req, res) => {
  try {
    const teacher = await Teacher.findOne();
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// [CREATE or UPDATE - Admin] Profile එක Save හෝ Update කිරීම
// POST /api/teacher
router.post('/', protectAdmin, async (req, res) => {
  try {
    let teacher = await Teacher.findOne();

    if (teacher) {
      teacher = await Teacher.findByIdAndUpdate(teacher._id, req.body, {
        new: true,
        runValidators: true,
      });
      return res.json(teacher);
    }

    teacher = new Teacher(req.body);
    const savedTeacher = await teacher.save();
    res.status(201).json(savedTeacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// [DELETE - Admin] Teacher profile එක reset / delete කිරීම
// DELETE /api/teacher
router.delete('/', protectAdmin, async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndDelete();
    if (!teacher) {
      return res.status(404).json({ message: 'No teacher profile to delete' });
    }
    res.json({ message: 'Teacher profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;