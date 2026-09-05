const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const uploadDirectory = path.join(__dirname, 'uploads');

fs.mkdirSync(uploadDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDirectory,
    filename: (request, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const safeName = path.basename(file.originalname, extension)
        .replace(/[^a-z0-9-_]/gi, '-')
        .replace(/-+/g, '-')
        .toLowerCase();
      callback(null, `${Date.now()}-${safeName || 'photo'}${extension}`);
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (request, file, callback) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Only JPG, PNG, and WebP images are allowed.'));
    }
  }
});

app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDirectory));

app.post('/api/upload', upload.single('file'), (request, response) => {
  if (!request.file) {
    return response.status(400).json({ error: 'Please upload a JPG, PNG, or WebP image under 10 MB.' });
  }

  response.json({
    url: `${request.protocol}://${request.get('host')}/uploads/${encodeURIComponent(request.file.filename)}`
  });
});

app.use((error, request, response, next) => {
  if (error instanceof multer.MulterError || error.message) {
    return response.status(400).json({ error: error.message });
  }
  next(error);
});

app.listen(port, () => {
  console.log(`Photo server running at http://localhost:${port}`);
});
