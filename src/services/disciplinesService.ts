import errors from "../utils/errorFunctions.js";
import disciplinesRepository, {
  insertDisciplineData,
} from "./../repositories/disciplineRepository.js";

async function insert(data: insertDisciplineData) {
  const termNumber = parseInt(data.term);
  if (termNumber > 12 || termNumber < 1) throw errors.badRequestError("term");

  const discipline = await disciplinesRepository.findByName(data.name);
  if (discipline) throw errors.conflictRequestError("discipline");

  await disciplinesRepository.insert(data);
}

const disciplinesService = {
  insert,
};
export default disciplinesService;
