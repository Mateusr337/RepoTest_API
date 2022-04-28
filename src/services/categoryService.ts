import categoryRepository from "../repositories/categoryRepository.js";
import errors from "../utils/errorFunctions.js";

async function insert(name: string) {
  const category = await categoryRepository.getByName(name);
  if (category) throw errors.conflictRequestError("category Name");

  validateCategoryName(name);

  await categoryRepository.insert(name);
}

function validateCategoryName(name: string) {
  const arrayName = name.toLocaleUpperCase().split(" ");
  const pattern = /^P[1-9]{1}$/;

  const verify = pattern.test(arrayName[0]);
  if (!verify) throw errors.badRequestError("format invalid");

  if (arrayName[1] !== "REC") throw errors.badRequestError("format invalid");
}

const categoryService = {
  insert,
};
export default categoryService;
