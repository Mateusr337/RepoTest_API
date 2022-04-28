import joi from "joi";

const nameSchema = joi.object({
  name: joi.string().required(),
});

export default nameSchema;
