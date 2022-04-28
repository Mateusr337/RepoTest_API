import { Request, Response } from "express";
import teachersService from "../services/teachersService.js";

async function insert(req: Request, res: Response) {
  await teachersService.insert(req.body.name);
  res.sendStatus(201);
}

const teachersController = {
  insert,
};
export default teachersController;
