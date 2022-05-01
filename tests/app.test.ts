import { type } from "os";
import supertest from "supertest";
import seed from "../prisma/seed";
import app from "../src/app";
import client from "../src/database";
import { createInsertTestData, insertTestCreateUserToken } from "./factories/testFactory";
import { createUser, createUserData, CreateUserToken } from "./factories/userFactory";

const agent = supertest(app);

async function truncate(table: string) {
  await client.$executeRawUnsafe(`TRUNCATE TABLE ${table};`);
}

beforeEach((done) => done());
afterEach(async () => client.$disconnect());

describe("testing page: /sign-up", () => {
  beforeEach(async () => await truncate("users"));

  describe("POST sign-up", () => {
    it("should answer with status code 201 - create user", async () => {
      const user = await createUserData();

      const response = await agent.post("/register").send(user);
      expect(response.status).toEqual(201);

      const createdUser = await client.users.findUnique({ where: { email: user.email } });
      expect(createdUser).not.toBeNull();
    });

    it("should answer with status code 422 - wrong body", async () => {
      const user = {};

      const response = await agent.post("/register").send(user);
      expect(response.status).toEqual(422);

      const countUsers = await client.users.count();
      expect(countUsers).toEqual(0);
    });

    it("should answer with status code 409 - create user conflict", async () => {
      const user = await createUserData();

      const response = await agent.post("/register").send(user);
      const response2 = await agent.post("/register").send(user);

      expect(response.status).toEqual(201);
      expect(response2.status).toEqual(409);

      const countUsers = await client.users.count();
      expect(countUsers).toEqual(1);
    });
  });
});

describe("testing page: /sign-in", () => {
  beforeEach(async () => {
    await truncate("users");
    await truncate("sessions");
  });

  describe("POST sign-in", () => {
    it("should answer with status code 201 and token - create login", async () => {
      const user = await createUser();

      const response = await agent
        .post("/login")
        .send({ email: user.email, password: user.cleanPassword });

      expect(response.status).toEqual(200);
      expect(typeof response.body.token).toEqual("string");
      expect(response.body.token.length).toBeGreaterThan(0);

      const session = await client.sessions.findFirst({ where: { token: response.body.token } });
      expect(session).not.toBeNull();
    });

    it("should answer with status code 401 - wrong email", async () => {
      const user = await createUser();

      const response = await agent.post("/login").send({
        email: "fulano@email.com",
        password: user.cleanPassword,
      });
      expect(response.status).toEqual(401);

      const countSession = await client.sessions.count();
      expect(countSession).toEqual(0);
    });

    it("should answer with status code 401 - wrong password", async () => {
      const user = await createUser();

      const response = await agent.post("/login").send({
        email: user.email,
        password: user.password,
      });
      expect(response.status).toEqual(401);

      const countSession = await client.sessions.count();
      expect(countSession).toEqual(0);
    });
  });
});

describe("testing authentication after github login", () => {
  beforeEach(async () => await truncate("users"));

  describe("POST /login/github", () => {
    it("should answer with token", async () => {
      const user = await createUserData();

      const response = await agent.post("/login/github").send({ email: user.email });

      expect(response.status).toEqual(200);
      expect(response.body.token).not.toBeNull();
    });
  });
});

describe("testing router: /categories", () => {
  describe("GET /categories", () => {
    it("should answer with not null array", async () => {
      const { headers } = await CreateUserToken();

      const response = await agent.get("/categories").set({ ...headers });

      expect(response.status).toEqual(200);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should answer with status code 401", async () => {
      const { headers } = await CreateUserToken();

      const response = await agent.get("/categories").set({});

      expect(response.status).toEqual(401);
      expect(response.body).toEqual({});
    });
  });
});

describe("testing router: /disciplines", () => {
  describe("GET /disciplines", () => {
    it("should answer with not null array", async () => {
      const { headers } = await CreateUserToken();

      const response = await agent
        .get("/disciplines")
        .set({ Authorization: headers.Authorization });

      expect(response.status).toEqual(200);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should answer with not null array - term filter", async () => {
      const { headers } = await CreateUserToken();

      const discipline = await client.disciplines.findFirst();

      const response = await agent
        .get(`/disciplines?term=${discipline.term}`)
        .set({ Authorization: headers.Authorization });

      expect(response.status).toEqual(200);
      expect(response.body.length).not.toBeNull();
    });

    it("should answer with status code 401", async () => {
      const { headers } = await CreateUserToken();

      const response = await agent.get("/categories").set({});

      expect(response.status).toEqual(401);
      expect(response.body).toEqual({});
    });
  });
});

describe("testing router: /teachers", () => {
  describe("GET /teachers", () => {
    it("should answer with not null array", async () => {
      const { headers } = await CreateUserToken();

      const response = await agent.get("/teachers").set({ ...headers });

      expect(response.status).toEqual(200);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should answer with status code 401", async () => {
      const { headers } = await CreateUserToken();

      const response = await agent.get("/teachers").set({});

      expect(response.status).toEqual(401);
      expect(response.body).toEqual({});
    });
  });
});

describe("testing router: /tests", () => {
  beforeEach(async () => truncate("tests"));

  describe("POST /test", () => {
    it("should answer with status code 201", async () => {
      const { user, headers } = await CreateUserToken();
      const { category, discipline, teacher, name, pdf } = await createInsertTestData("pdf.pdf");

      const response = await agent
        .post("/tests")
        .set({ Authorization: headers.Authorization, "Content-Type": "multipart/form-data" })
        .field("discipline", discipline.name)
        .field("category", category.name)
        .field("teacher", teacher.name)
        .field("name", name)
        .attach("pdf", pdf);

      expect(response.status).toEqual(201);

      const tests = await client.tests.count();
      expect(tests).toEqual(1);
    });

    it("should answer with status code 422 - wrong type file", async () => {
      const { user, headers } = await CreateUserToken();
      const { category, discipline, teacher, name, pdf } = await createInsertTestData("png.png");

      const response = await agent
        .post("/tests")
        .set({ Authorization: headers.Authorization, "Content-Type": "multipart/form-data" })
        .field("discipline", discipline.name)
        .field("category", category.name)
        .field("teacher", teacher.name)
        .field("name", name)
        .attach("pdf", pdf);

      expect(response.status).toEqual(422);

      const tests = await client.tests.count();
      expect(tests).toEqual(0);
    });

    it("should answer with status code 422 - don't send file", async () => {
      const { user, headers } = await CreateUserToken();
      const { category, discipline, teacher, name, pdf } = await createInsertTestData("pdf.pdf");

      const response = await agent
        .post("/tests")
        .set({ Authorization: headers.Authorization, "Content-Type": "multipart/form-data" })
        .field("discipline", discipline.name)
        .field("category", category.name)
        .field("teacher", teacher.name)
        .field("name", name)
        .attach("pdf", "");

      expect(response.status).toEqual(422);

      const tests = await client.tests.count();
      expect(tests).toEqual(0);
    });

    it("should answer with status code 401", async () => {
      const { user, headers } = await CreateUserToken();
      const { category, discipline, teacher, name, pdf } = await createInsertTestData("pdf.pdf");

      const response = await agent
        .post("/tests")
        .set({ Authorization: "bananinha", "Content-Type": "multipart/form-data" })
        .field("discipline", discipline.name)
        .field("category", category.name)
        .field("teacher", teacher.name)
        .field("name", name)
        .attach("pdf", pdf);

      expect(response.status).toEqual(401);

      const tests = await client.tests.count();
      expect(tests).toEqual(0);
    });

    it("should answer with status code 422 - wrong body", async () => {
      const { user, headers } = await CreateUserToken();

      const response = await agent
        .post("/tests")
        .set({ ...headers })
        .send({});

      expect(response.status).toEqual(422);

      const tests = await client.tests.count();
      expect(tests).toEqual(0);
    });

    it("should answer with status code 404 - not found category", async () => {
      const { user, headers } = await CreateUserToken();
      const { category, discipline, teacher, name, pdf } = await createInsertTestData("pdf.pdf");

      const response = await agent
        .post("/tests")
        .set({ Authorization: headers.Authorization, "Content-Type": "multipart/form-data" })
        .field("discipline", discipline.name)
        .field("category", "banana")
        .field("teacher", teacher.name)
        .field("name", name)
        .attach("pdf", pdf);

      expect(response.status).toEqual(404);

      const tests = await client.tests.count();
      expect(tests).toEqual(0);
    });

    it("should answer with status code 404 - not found discipline", async () => {
      const { user, headers } = await CreateUserToken();
      const { category, discipline, teacher, name, pdf } = await createInsertTestData("pdf.pdf");

      const response = await agent
        .post("/tests")
        .set({ Authorization: headers.Authorization, "Content-Type": "multipart/form-data" })
        .field("discipline", "bananinha")
        .field("category", category.name)
        .field("teacher", teacher.name)
        .field("name", name)
        .attach("pdf", pdf);

      expect(response.status).toEqual(404);

      const tests = await client.tests.count();
      expect(tests).toEqual(0);
    });

    it("should answer with status code 404 - not found teacher", async () => {
      const { user, headers } = await CreateUserToken();
      const { category, discipline, teacher, name, pdf } = await createInsertTestData("pdf.pdf");

      const response = await agent
        .post("/tests")
        .set({ Authorization: headers.Authorization, "Content-Type": "multipart/form-data" })
        .field("discipline", discipline.name)
        .field("category", category.name)
        .field("teacher", "bananinha")
        .field("name", name)
        .attach("pdf", pdf);

      expect(response.status).toEqual(404);

      const tests = await client.tests.count();
      expect(tests).toEqual(0);
    });
  });

  describe("GET /tests", () => {
    beforeEach(async () => truncate("tests"));

    it("should answer with not null array", async () => {
      const { headers } = await CreateUserToken();

      const response = await agent.get("/tests").set({ ...headers });

      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(0);
    });

    it("should answer with status code 401", async () => {
      const { headers } = await CreateUserToken();

      const response = await agent.get("/tests").set({});

      expect(response.status).toEqual(401);
    });

    it("should answer with not null array - category filter", async () => {
      const { user, headers, test } = await insertTestCreateUserToken();

      const category = await client.categories.findUnique({ where: { id: test.categoryId } });

      const response = await agent.get(`/tests?category=${category.name}`).set({ ...headers });

      expect(response.status).toEqual(200);
      expect(response.body).not.toBeNull();
    });

    it("should answer with not null array - discipline filter", async () => {
      const { user, headers, test } = await insertTestCreateUserToken();

      const teachersDisciplines = await client.teachersDiciplines.findUnique({
        where: { id: test.teacherDisciplineId },
      });

      const discipline = await client.disciplines.findUnique({
        where: { id: teachersDisciplines.disciplineId },
      });

      const response = await agent.get(`/tests?discipline=${discipline.name}`).set({ ...headers });

      expect(response.status).toEqual(200);
      expect(response.body).not.toBeNull();

      const responseSearch = await agent
        .get(`/tests?discipline=${discipline.name[0]}&search=yes`)
        .set({ ...headers });

      expect(responseSearch.status).toEqual(200);
      expect(responseSearch.body).not.toBeNull();
    });

    it("should answer with not null array - teacher filter", async () => {
      const { user, headers, test } = await insertTestCreateUserToken();

      const teachersDisciplines = await client.teachersDiciplines.findUnique({
        where: { id: test.teacherDisciplineId },
      });

      const teacher = await client.teachers.findUnique({
        where: { id: teachersDisciplines.teacherId },
      });

      const response = await agent.get(`/tests?teacher=${teacher.name}`).set({ ...headers });

      expect(response.status).toEqual(200);
      expect(response.body).not.toBeNull();

      const responseSearch = await agent
        .get(`/tests?teacher=${teacher.name[0]}&search=yes`)
        .set({ ...headers });

      expect(responseSearch.status).toEqual(200);
      expect(responseSearch.body).not.toBeNull();
    });
  });

  describe("PUT /test/:id ", () => {
    it("should answer with status code 204 - views", async () => {
      const { user, headers, test } = await insertTestCreateUserToken();

      const newViews = parseInt(test.views) + 1;

      const response = await agent
        .put(`/tests/${test.id}`)
        .set({ ...headers })
        .send({ views: newViews });

      const { views } = await client.tests.findFirst();

      expect(response.status).toEqual(204);
      expect(views).toEqual(newViews.toString());
    });
  });
});
