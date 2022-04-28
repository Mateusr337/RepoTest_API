import client from "../database.js";

export async function getTeacherDisciplineByIds(teacherId: number, disciplineId: number) {
  const teacherDiscipline = client.teachersDiciplines.findFirst({
    where: { AND: [{ teacherId }, { disciplineId }] },
  });
  return teacherDiscipline;
}

async function insertTeacherDiscipline(teacherId: number, disciplineId: number) {
  const teacherDiscipline = client.teachersDiciplines.create({
    data: { teacherId, disciplineId },
  });
  return teacherDiscipline;
}

const teachersDisciplinesRepository = {
  getTeacherDisciplineByIds,
  insertTeacherDiscipline,
};
export default teachersDisciplinesRepository;
