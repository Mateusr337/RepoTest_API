import categoryRepository from "../repositories/categoryRepository.js";
import errors from "../utils/errorFunctions.js";

async function insert(name: string) {
  const category = await categoryRepository.getByName(name);
  if (category) throw errors.conflictRequestError("category Name");

  validateCategoryName(name);
  await categoryRepository.insert(name);
}

async function getByName(name: string) {
  const category = await categoryRepository.getByName(name);
  return category;
}

function validateCategoryName(name: string) {
  const arrayName = name.toLocaleUpperCase().split(" ");
  const pattern = /^P[1-9]{1}$/;

  const verify = pattern.test(arrayName[0]);
  if (!verify) throw errors.badRequestError("format invalid");

  if (arrayName[1] && arrayName[1] !== "REC") throw errors.badRequestError("format invalid");
}

async function get() {
  const categories = await categoryRepository.get();
  return categories;
}

const categoryService = {
  insert,
  getByName,
  get,
};
export default categoryService;
