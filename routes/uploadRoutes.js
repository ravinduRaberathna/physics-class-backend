const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { protectAdmin } = require('../middleware/authMiddleware');

// [GET - Admin] Cloudinary Signed Upload සඳහා Signature එක ලබා ගැනීම
// GET /api/upload/signature
router.get('/signature', protectAdmin, (req, res) => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return res.status(400).json({
        message:
          'Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are missing in backend .env',
      });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'physics_class';

    // Cloudinary signature string (alphabetical order of params + apiSecret)
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    res.json({
      timestamp,
      signature,
      cloudName,
      apiKey,
      folder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

