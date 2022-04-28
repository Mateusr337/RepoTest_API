import { Request, Response } from "express";
import disciplinesService from "../services/disciplinesService.js";

async function insert(req: Request, res: Response) {
  await disciplinesService.insert(req.body);
  res.sendStatus(201);
}

const disciplineController = {
  insert,
};
export default disciplineController;
