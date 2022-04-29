import errors from "../utils/errorFunctions.js";
import disciplinesRepository, {
  insertDisciplineData,
} from "./../repositories/disciplineRepository.js";

async function insert(data: insertDisciplineData) {
  const termNumber = parseInt(data.term);
  if (termNumber > 12 || termNumber < 1) throw errors.badRequestError("term");

  const discipline = await disciplinesRepository.getByName(data.name);
  if (discipline) throw errors.conflictRequestError("discipline");

  await disciplinesRepository.insert(data);
}

async function getByName(name: string) {
  const discipline = await disciplinesRepository.getByName(name);
  return discipline;
}

async function get(term: string) {
  const disciplines = await disciplinesRepository.get(term);
  return disciplines;
}

const disciplinesService = {
  insert,
  getByName,
  get,
};
export default disciplinesService;
