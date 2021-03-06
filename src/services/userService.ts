import { usersPartial } from "./../repositories/userRepository";
import jwt from "jsonwebtoken";
import userRepository, { usersInsertData } from "../repositories/userRepository.js";
import encryptFunctions from "../utils/encryptFunction.js";
import errors from "../utils/errorFunctions.js";

async function insert(signUpData: usersInsertData) {
  const users = await userRepository.find({ email: signUpData.email });
  if (users.length > 0) throw errors.conflictRequestError("email");

  validatePassword(signUpData.password);

  signUpData.password = encryptFunctions.encryptData(signUpData.password);
  await userRepository.insert(signUpData);
}

function validatePassword(password: string) {
  const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])(?:([0-9a-zA-Z$*&@#])(?!\1)){8,}$/;
  const validation = pattern.test(password);
  if (!validation) throw errors.badRequestError("password");
}

async function validateUserById(id: number) {
  const user = await userRepository.findById(id);
  if (!user) throw errors.notFoundError("id");
  return user;
}

async function find(filters: usersPartial) {
  const users = await userRepository.find({});
  return users;
}

async function login(data: usersInsertData) {
  const user = (await userRepository.find({ email: data.email }))[0];
  if (!user) throw errors.unauthorizedError("email or password");

  await encryptFunctions.compareEncrypted(data.password, user.password);

  const expiration = { expiresIn: 60 * 60 * 24 * 30 };
  const token: string = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, expiration);

  await userRepository.insertSession(token);
  return token;
}

async function findSessionById(id: number) {
  const session = await userRepository.findSessionsById(id);
  if (!session) throw errors.notFoundError("session");
  return session;
}

async function loginWithGithub(email: string) {
  let user = (await userRepository.find({ email }))[0];
  if (!user) user = await userRepository.insert({ email, password: null });

  const expiration = { expiresIn: 60 * 60 * 24 * 30 };
  const token: string = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, expiration);

  const session = await userRepository.insertSession(token);

  return token;
}

const userService = {
  validateUserById,
  insert,
  loginWithGithub,
  findSessionById,
  login,
  find,
};

export default userService;
