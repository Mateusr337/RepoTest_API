import { tests } from "@prisma/client";
import client from "../database.js";

export interface InsertTestsData {
  name: string;
  pdfUrl: string;
  category: string;
  rec: "yes" | "no";
  term: string;
  teacher: string;
  discipline: string;
}

export type formatInsertData = Omit<tests, "id">;

async function insert(data: formatInsertData) {
  await client.tests.create({ data });
}

async function get(discipline: string, category: string) {
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
      ],
    },
  });
  return tests;
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
};
export default testsRepository;
