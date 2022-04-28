import joi from "joi";

const testSchema = joi.object({
  name: joi.string().required(),
  category: joi.string().required(),
  teacher: joi.string().required(),
  discipline: joi.string().required(),
});

export default testSchema;
