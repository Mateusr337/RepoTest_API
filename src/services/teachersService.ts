import teacherRepository from "../repositories/teacherRepository.js";
import errors from "../utils/errorFunctions.js";

async function insert(name: string) {
  const teacher = await getByName(name);
  if (teacher) throw errors.conflictRequestError("teachers");

  await teacherRepository.insert(name);
}

async function getByName(name: string) {
  const teacher = await teacherRepository.getByName(name);
  return teacher;
}

async function get() {
  const teacher = await teacherRepository.get();
  return teacher;
}

const teachersService = {
  insert,
  getByName,
  get,
};
export default teachersService;
