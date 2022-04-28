import joi from "joi";

const testSchema = joi.object({
  name: joi.string().required(),
  pdfUrl: joi.required(),
  category: joi
    .string()
    .required()
    .pattern(/^P[0-9]{1}$/),
  rec: joi.string().required().valid("yes", "no"),
  term: joi.number().integer().required(),
  teacher: joi.string().required(),
  discipline: joi.string().required(),
});

export default testSchema;
