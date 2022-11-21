import PasswordValidator from "password-validator";

const Password_validator = new PasswordValidator();

const password_valid = (password: string) => {
  Password_validator.is()
    .min(8) // Minimum length 8
    .is()
    .max(100) // Maximum length 100
    .has()
    .uppercase(1) // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(2) // Must have at least 2 digits
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123", "123456789", "password"]);

  return Password_validator.validate(password);
};

export = password_valid;
