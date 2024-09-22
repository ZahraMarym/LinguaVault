const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Define allowed file types
const ALLOWED_FILE_TYPES = /mp3|wav|mpeg/;

// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/')); // Ensure the path is correct
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

// Define file filter function
const fileFilter = (req, file, cb) => {
  // Check the file extension and MIME type
  const extname = ALLOWED_FILE_TYPES.test(path.extname(file.originalname).toLowerCase());
  const mimetype = ALLOWED_FILE_TYPES.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only MP3, WAV, and MPEG files are allowed.'), false); // Reject the file
  }
};

const upload = multer({
  dest: path.join(__dirname, 'uploads'), // Directory to save uploaded files
  limits: { fileSize: 50 * 1024 * 1024 } // Set file size limit to 50MB
});

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

module.exports = upload;
