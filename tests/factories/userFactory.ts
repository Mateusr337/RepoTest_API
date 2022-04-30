import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";
import client from "../../src/database.js";

export async function createUser() {
  const user = {
    email: faker.internet.email(),
    password: "Bananinha@123",
    hashedPassword: bcrypt.hashSync("Bananinha@123", 10),
  };

  const insertedUser = await client.users.create({
    data: {
      email: user.email,
      password: bcrypt.hashSync(user.password, 10),
    },
  });

  return { ...insertedUser, cleanPassword: user.password };
}

export async function createUserData() {
  const user = {
    email: faker.internet.email(),
    password: "Bananinha@123",
  };

  return user;
}

export async function CreateUserToken() {
  const user = await createUser();

  const expiration = { expiresIn: 60 * 60 * 24 * 30 };
  const token: string = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, expiration);

  const session = await client.sessions.create({ data: { token } });
  const headers = config(token);

  return { user, headers, session };
}

const config = (token: string) => {
  const headers = { Authorization: `Bearer ${token}` };
  return headers;
};
