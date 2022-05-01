import testsRepository from "../repositories/testsRepository.js";
import supabaseBucket from "../supabase.js";
import errors from "../utils/errorFunctions.js";
import categoryService from "./categoryService.js";
import disciplinesService from "./disciplinesService.js";
import teachersDisciplinesService from "./teachersDisciplineService.js";
import teachersService from "./teachersService.js";
import sendEmail from "../utils/sendEmails.js";
import userService from "./userService.js";
import { tests } from "@prisma/client";

async function insert(body: any, file: any) {
  const { category, teacher, discipline, name } = body;

  if (!file) throw errors.badRequestError("don't send file");
  if (file.mimetype !== "application/pdf") throw errors.badRequestError("wrong file type");

  const foundCategory = await categoryService.getByName(category);
  if (!foundCategory) throw errors.notFoundError("category");

  const foundTeacher = await teachersService.getByName(teacher);
  if (!foundTeacher) throw errors.notFoundError("teacher");

  const foundDiscipline = await disciplinesService.getByName(discipline);
  if (!foundDiscipline) throw errors.notFoundError("discipline");

  const teachersDisciplines = await returnTeachersDisciplines(foundTeacher.id, foundDiscipline.id);
  const url = await insertFileSupabase(file);

  const test = await testsRepository.insert({
    name,
    pdfUrl: url,
    categoryId: foundCategory.id,
    teacherDisciplineId: teachersDisciplines.id,
    views: "0",
  });

  await sendEmailsToUsers(test);
}

async function sendEmailsToUsers(test: tests) {
  const users = await userService.find({});
  const emailsOfUsers = users.map((user) => user.email);

  await sendEmail(emailsOfUsers, test);
}

async function insertFileSupabase(file: any) {
  const fileName = `public/${Date.now()}-${file.originalname}`;

  try {
    const { data } = await supabaseBucket.upload(fileName, file.buffer, {
      cacheControl: "3600",
      upsert: true,
      contentType: "application/pdf",
    });
    const { publicURL } = supabaseBucket.getPublicUrl(data.Key.replace("repo-test/", ""));

    return publicURL;
  } catch {
    new Error("Supabase error");
  }
}

async function get(discipline: string, category: string, search: string, teacher: string) {
  let tests = [];
  if (search) {
    tests = await testsRepository.getSearch(discipline, teacher);
  } else {
    tests = await testsRepository.get(discipline, category, teacher);
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

async function putViews(views: string, id: number) {
  const test = await getById(id);

  if (parseInt(views) < 1) throw errors.badRequestError("view value");

  await testsRepository.putViews(views, id);
}

async function getById(id: number) {
  const test = await testsRepository.getById(id);
  if (!test) throw errors.notFoundError("test");
  return test;
}

const testsService = {
  insert,
  get,
  getById,
  putViews,
};
export default testsService;
