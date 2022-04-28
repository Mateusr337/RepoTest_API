import { Request, Response } from "express";
import disciplinesService from "../services/disciplinesService.js";

async function insert(req: Request, res: Response) {
  await disciplinesService.insert(req.body);
  res.sendStatus(201);
}

async function get(req: Request, res: Response) {
  const disciplines = await disciplinesService.get();
  res.send(disciplines);
}

const disciplineController = {
  insert,
  get,
};
export default disciplineController;
