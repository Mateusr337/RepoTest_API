import { teachers } from "@prisma/client";
import client from "../database.js";

export type insertTeacherData = Omit<teachers, "id">;

async function getAll() {
  const teachers = client.teachers.findMany();
  return teachers;
}

async function getByName(name: string) {
  const nomeLower = name.toLowerCase();
  const teacher = client.teachers.findUnique({ where: { name: nomeLower } });
  return teacher;
}

async function searchName(name: string) {
  const nomeLower = name.toLowerCase();
  const teacher = client.teachers.findMany({ where: { name: { contains: nomeLower } } });
  return teacher;
}

async function insert(name: string) {
  const nameLower = name.toLowerCase();
  const teacher = client.teachers.create({ data: { name: nameLower } });
  return teacher;
}

// export async function getTeacherDisciplineByIds(teacherId: number, disciplineId: number) {
//   const teacherDiscipline = client.teachersDiciplines.findFirst({
//     where: { AND: [{ teacherId }, { disciplineId }] },
//   });
//   return teacherDiscipline;
// }

// // async function insertTeacherDiscipline(teacherId: number, disciplineId: number) {
// //   const teacherDiscipline = client.teachersDiciplines.create({
// //     data: { teacherId, disciplineId },
// //   });
// //   return teacherDiscipline;
// }

const teacherRepository = {
  insert,
  getAll,
  getByName,
  searchName,
};
export default teacherRepository;
