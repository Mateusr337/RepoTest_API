import { faker } from "@faker-js/faker";
import client from "../../src/database.js";
import path from "path";
import supertest from "supertest";
import app from "../../src/app.js";
import { CreateUserToken } from "./userFactory.js";

export async function createInsertTestData(fileName: string) {
  const category = await client.categories.findFirst();
  const discipline = await client.disciplines.findFirst();
  const teacher = await client.teachers.findFirst();

  const testName = faker.name.jobDescriptor();
  const file = getFile("./tests/uploads", fileName);

  const data = { category, discipline, teacher, name: testName, pdf: file };

  return data;
}

export async function insertTestCreateUserToken() {
  const { user, headers } = await CreateUserToken();
  const { category, discipline, teacher, name, pdf } = await createInsertTestData("pdf.pdf");

  const response = await supertest(app)
    .post("/tests")
    .set({ ...headers })
    .field("discipline", discipline.name)
    .field("category", category.name)
    .field("teacher", teacher.name)
    .field("name", name)
    .attach("pdf", pdf);

  const test = await client.tests.findFirst();
  return { test, user, headers };
}

function getFile(relativePath: string, fileName: string) {
  const __dirname = path.resolve(relativePath, fileName);
  return __dirname;
}
