const multer = require('multer');

const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,  
  },
});

module.exports = multerConfig;
