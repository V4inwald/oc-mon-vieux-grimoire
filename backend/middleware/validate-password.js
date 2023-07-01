const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();
passwordSchema
  // Minimum length 8
  .is()
  .min(8)
  // Maximum length 25
  .is()
  .max(25)
  // Must have uppercase letters
  .has()
  .uppercase()
  // Must have lowercase letters
  .has()
  .lowercase()
  // Must have at least 2 digits
  .has()
  .digits()
  // Should not have spaces
  .has()
  .not()
  .spaces();

module.exports = (req, res, next) => {
  const userPassword = req.body.password;
  if (!passwordSchema.validate(userPassword)) {
    return res.status(400).json({
      error: `Le mot de passe ne respecte pas ces règles 
      ${passwordSchema.validate(userPassword, { list: true })}`,
    });
  }
  next();
};
