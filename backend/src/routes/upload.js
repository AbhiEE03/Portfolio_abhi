const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'portfolio-abhi',
        },
        (error, uploaded) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(uploaded);
        },
      );

      stream.end(req.file.buffer);
    });

    return res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error.message);
    return res.status(500).json({ message: 'Image upload failed' });
  }
});

module.exports = router;
