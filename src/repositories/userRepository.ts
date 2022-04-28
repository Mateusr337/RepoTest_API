import { users } from "@prisma/client";
import client from "../database.js";

export type usersInsertData = Omit<users, "id">;
export type usersPartial = Partial<users>;

async function findById(id: number) {
  const user = await client.users.findUnique({
    where: { id },
  });
  return user;
}

async function find(userData: usersPartial) {
  const users = await client.users.findMany({
    where: { ...userData },
  });
  return users;
}

async function insert(data: usersInsertData) {
  const user = await client.users.create({ data });
  return user;
}

async function insertSession(token: string) {
  const session = await client.sessions.create({ data: { token } });
  return session;
}

async function findSessionsById(id: number) {
  const session = await client.sessions.findUnique({
    where: { id },
  });
  return session;
}

const userRepository = {
  insert,
  findById,
  find,
  insertSession,
  findSessionsById,
};

export default userRepository;
