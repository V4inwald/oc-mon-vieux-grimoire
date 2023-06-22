const sharp = require("sharp");
const path = require("path");

module.exports = async (req, res, next) => {
  let fileName;
  //in there is a file optimizes it, if not does nothing
  if (req.file) {
    const { buffer, originalname } = req.file;
    //removes spaces from originalname
    let name = originalname.split(" ").join("_");
    //gets the name without extension
    name = path.parse(name).name;
    fileName = `${name}-${Date.now()}-optimized.webp`;

    await sharp(buffer)
      .resize({
        //resize to twice the size of ".BookImage"
        width: 412,
        height: 520,
        fit: "cover",
      })
      .webp({ quality: 80 })
      .toFile("./images/" + fileName)
      .catch((error) => res.status(500).json({ error }));
  }

  req.fileName = fileName;
  next();
};
