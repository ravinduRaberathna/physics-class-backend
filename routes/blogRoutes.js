const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protectAdmin } = require('../middleware/authMiddleware');

// 1. [READ - Public] Active blog posts පමණක් ලබාගැනීම
// GET /api/blogs/public
router.get('/public', async (req, res) => {
  try {
    const blogs = await Blog.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

// 1b. [READ - Public Single] තනි Blog post එකක් ලබාගැනීම
// GET /api/blogs/public/:id
router.get('/public/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || !blog.isActive) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog post', error: error.message });
  }
});

// 2. [READ - Admin] සියලුම blog posts ලබාගැනීම
// GET /api/blogs
router.get('/', protectAdmin, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all blogs', error: error.message });
  }
});

// 3. [CREATE - Admin] අලුත් blog post එකක් එකතු කිරීම
// POST /api/blogs
router.post('/', protectAdmin, async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    const saved = await newBlog.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error creating blog post', error: error.message });
  }
});

// 4. [UPDATE - Admin] Blog post එකක් update කිරීම
// PUT /api/blogs/:id
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating blog post', error: error.message });
  }
});

// 5. [DELETE - Admin] Blog post එකක් delete කිරීම
// DELETE /api/blogs/:id
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog post', error: error.message });
  }
});

module.exports = router;

