import supertest from "supertest";
import seed from "../prisma/seed";
import app from "../src/app";
import client from "../src/database";
import { createUser, createUserData, CreateUserToken } from "./factories/userFactory";

const agent = supertest(app);

async function truncate(table: string) {
  await client.$executeRawUnsafe(`TRUNCATE TABLE ${table};`);
}

afterAll(async () => client.$disconnect());

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

describe("testing router: /categories", () => {
  describe("GET /categories", () => {
    it("should answer with not null array", async () => {
      const { headers } = await CreateUserToken();

      const response = await agent.get("/categories").set({ Authorization: headers.Authorization });

      expect(response.status).toEqual(200);
      expect(response.body.length).toBeGreaterThan(0);
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

    it("should answer with not null array", async () => {
      const { headers } = await CreateUserToken();

      const response = await agent.get("/categories").set({ Authorization: headers.Authorization });

      expect(response.status).toEqual(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});

describe("testing router: /teachers", () => {
  describe("GET /teachers", () => {
    it("should answer with not null array", async () => {
      const { headers } = await CreateUserToken();

      const response = await agent.get("/teachers").set({ Authorization: headers.Authorization });

      expect(response.status).toEqual(200);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
});

describe("testing router: /tests", () => {
  describe("GET /tests", () => {
    it("should answer with not null array", async () => {
      const { headers } = await CreateUserToken();

      const response = await agent.get("/tests").set({ Authorization: headers.Authorization });

      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(0);
    });

    it("should answer with not null array - query", async () => {
      const { headers } = await CreateUserToken();

      const response = await agent.get("/tests").set({ Authorization: headers.Authorization });

      expect(response.status).toEqual(200);
      expect(response.body.length).toEqual(0);
    });
  });
});
