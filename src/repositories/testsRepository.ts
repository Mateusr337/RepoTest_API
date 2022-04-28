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

export async function insert(data: formatInsertData) {
  await client.tests.create({ data });
}

export async function getAll() {
  const tests = await client.tests.findMany({
    include: {
      category: true,
      teacherDiscipline: {
        include: {
          discipline: {
            include: {
              term: true,
            },
          },
          teacher: true,
        },
      },
    },
  });
  return tests;
}
