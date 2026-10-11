const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher');
const cache = require('../utils/cache');
const { protectAdmin } = require('../middleware/authMiddleware');

// [READ - Public] සර්ගේ Profile එක බැලීම (Cached)
// GET /api/teacher
router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    const cached = cache.get('teacher_profile');
    if (cached) return res.json(cached);

    const teacher = await Teacher.findOne();
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }
    cache.set('teacher_profile', teacher, 600);
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
      cache.del('teacher_profile');
      return res.json(teacher);
    }

    teacher = new Teacher(req.body);
    const savedTeacher = await teacher.save();
    cache.del('teacher_profile');
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
    cache.del('teacher_profile');
    res.json({ message: 'Teacher profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;