const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    //remove "bearer"
    const token = req.headers.authorization.split(" ")[1];
    //checks that the token is valid
    const decodedToken = jwt.verify(token, `${process.env.TOKEN_RANDOM_KEY}`);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(403).json({ error });
  }
};
