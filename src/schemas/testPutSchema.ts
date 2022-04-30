import joi from "joi";

const testPutSchema = joi.object({
  name: joi.string(),
  category: joi.string(),
  teacher: joi.string(),
  discipline: joi.string(),
  views: joi.number().integer(),
});

export default testPutSchema;
