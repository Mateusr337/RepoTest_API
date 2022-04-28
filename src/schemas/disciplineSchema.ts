import joi from "joi";

const disciplineSchema = joi.object({
  name: joi.string().required(),
  term: joi.number().integer().required(),
});

export default disciplineSchema;
