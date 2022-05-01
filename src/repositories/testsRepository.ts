import { tests } from "@prisma/client";
import client from "../database.js";

export interface InsertTestsData {
  name: string;
  pdfUrl: string;
  category: string;
  teacher: string;
  discipline: string;
}

export type formatInsertData = Omit<tests, "id">;

async function insert(data: formatInsertData) {
  const test = await client.tests.create({ data: { ...data } });
  return test;
}

async function putViews(views: string, id: number) {
  await client.tests.update({
    where: { id },
    data: { views },
  });
}

async function get(discipline: string, category: string, teacher: string) {
  const tests = await client.tests.findMany({
    include: {
      category: true,
      teacherDiscipline: {
        include: {
          discipline: true,
          teacher: true,
        },
      },
    },
    where: {
      OR: [
        {
          category: {
            name: category,
          },
        },
        {
          teacherDiscipline: {
            discipline: {
              name: discipline,
            },
          },
        },
        {
          teacherDiscipline: {
            teacher: {
              name: teacher,
            },
          },
        },
      ],
    },
  });
  return tests;
}

async function getById(id: number) {
  const test = await client.tests.findUnique({ where: { id } });
  return test;
}

async function getSearch(discipline: string, teacher: string) {
  const tests = await client.tests.findMany({
    include: {
      category: true,
      teacherDiscipline: {
        include: {
          discipline: true,
          teacher: true,
        },
      },
    },
    where: {
      AND: [
        {
          teacherDiscipline: {
            discipline: {
              name: { contains: discipline },
            },
          },
        },
        {
          teacherDiscipline: {
            teacher: {
              name: { contains: teacher },
            },
          },
        },
      ],
    },
  });
  return tests;
}

const testsRepository = {
  insert,
  get,
  getSearch,
  putViews,
  getById,
};
export default testsRepository;
