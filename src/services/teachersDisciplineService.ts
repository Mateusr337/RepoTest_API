import teachersDisciplinesRepository from "../repositories/teachersDisciplinesRepository.js";

export async function getTeacherDisciplineByIds(teacherId: number, disciplineId: number) {
  const teacherDiscipline = await teachersDisciplinesRepository.getTeacherDisciplineByIds(
    teacherId,
    disciplineId
  );
  return teacherDiscipline;
}

async function insertTeacherDiscipline(teacherId: number, disciplineId: number) {
  const teacherDiscipline = await teachersDisciplinesRepository.insertTeacherDiscipline(
    teacherId,
    disciplineId
  );
  return teacherDiscipline;
}

const teachersDisciplinesService = {
  getTeacherDisciplineByIds,
  insertTeacherDiscipline,
};
export default teachersDisciplinesService;
