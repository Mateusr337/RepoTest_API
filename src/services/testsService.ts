import testsRepository from "../repositories/testsRepository.js";
import supabase from "../supabase.js";
import errors from "../utils/errorFunctions.js";
import categoryService from "./categoryService.js";
import disciplinesService from "./disciplinesService.js";
import teachersDisciplinesService from "./teachersDisciplineService.js";
import teachersService from "./teachersService.js";

async function insert(body: any, file: any) {
  const { category, teacher, discipline, name } = body;

  const foundCategory = await categoryService.getByName(category);
  if (!foundCategory) throw errors.notFoundError("category");

  const foundTeacher = await teachersService.getByName(teacher);
  if (!foundTeacher) throw errors.notFoundError("teacher");

  const foundDiscipline = await disciplinesService.getByName(discipline);
  if (!foundDiscipline) throw errors.notFoundError("discipline");

  const teachersDisciplines = await returnTeachersDisciplines(foundTeacher.id, foundDiscipline.id);
  const { Key: fileKey } = await insertFileSupabase(file);

  await testsRepository.insert({
    name,
    pdfUrl: fileKey,
    categoryId: foundCategory.id,
    teacherDisciplineId: teachersDisciplines.id,
  });
}

async function insertFileSupabase(file: any) {
  const { data, error } = await supabase.storage.from("pdfs").upload(`${file.filename}`, file);
  if (error) throw new Error("error with supabase");

  return data;
}

async function get(discipline: string, category: string, search: string, teacher: string) {
  let tests = [];
  if (search) {
    tests = await testsRepository.getSearch(discipline, teacher);
  } else {
    tests = await testsRepository.get(discipline, category);
  }
  return tests;
}

async function returnTeachersDisciplines(teacherId: number, disciplineId: number) {
  let teachersDisciplines = await teachersDisciplinesService.getTeacherDisciplineByIds(
    teacherId,
    disciplineId
  );
  if (!teachersDisciplines)
    teachersDisciplines = await teachersDisciplinesService.insertTeacherDiscipline(
      teacherId,
      disciplineId
    );
  return teachersDisciplines;
}

const testsService = {
  insert,
  get,
};
export default testsService;
