import { Request, Response } from "express";
import teachersService from "../services/teachersService.js";

async function insert(req: Request, res: Response) {
  await teachersService.insert(req.body.name);
  res.sendStatus(201);
}

async function get(req: Request, res: Response) {
  const teachers = await teachersService.get();
  res.send(teachers);
}

const teachersController = {
  insert,
  get,
};
export default teachersController;
