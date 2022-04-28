import teacherRepository from "../repositories/teacherRepository.js";
import errors from "../utils/errorFunctions.js";

async function insert(name: string) {
  const teacher = await teacherRepository.getByName(name);
  if (teacher) throw errors.conflictRequestError("teachers");

  await teacherRepository.insert(name);
}

const teachersService = {
  insert,
};
export default teachersService;
