const multer = require("multer");

//in memory storage
const storage = multer.memoryStorage();

module.exports = multer({ storage: storage }).single("image");
