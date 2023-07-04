const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, parseInt(process.env.SALT_ROUNDS))
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(200).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      //User doesn't exist
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          //Wrong Password
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          // Successfull Login
          res.status(200).json({
            userId: user._id,
            //JsonWebToken
            token: jwt.sign(
              { userId: user._id },
              `${process.env.TOKEN_RANDOM_KEY}`,
              { expiresIn: `${process.env.TOKEN_EXPIRATION}` }
            ),
          });
        })
        //Internal Server Error
        .catch((error) => res.status(500).json({ error }));
    })
    //Internal Server Error
    .catch((error) => res.status(500).json({ error }));
};
