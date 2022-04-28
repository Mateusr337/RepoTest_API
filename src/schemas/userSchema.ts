import joi from "joi";

const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])(?:([0-9a-zA-Z$*&@#])(?!\1)){8,}$/;

const userSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().pattern(pattern),
});

export default userSchema;
