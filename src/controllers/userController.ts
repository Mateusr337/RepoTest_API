import { Request, Response } from "express";
import userService from "../services/userService.js";

async function register(req: Request, res: Response) {
  await userService.insert(req.body);
  res.sendStatus(201);
}

async function login(req: Request, res: Response) {
  const token = await userService.login(req.body);
  res.send({ token: token });
}

async function loginWithGithub(req: Request, res: Response) {
  const { email } = req.body;

  const token = await userService.loginWithGithub(email);
  res.send({ token: token });
}

const userController = {
  register,
  login,
  loginWithGithub,
};
export default userController;
