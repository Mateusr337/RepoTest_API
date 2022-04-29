import { Request, Response } from "express";
import testsService from "../services/testsService.js";

async function insert(req: Request, res: Response) {
  const file = req.file;
  await testsService.insert(req.body, file);
  res.sendStatus(201);
}

async function get(req: Request, res: Response) {
  const discipline = req.query.discipline?.toString();
  const category = req.query.category?.toString();
  const search = req.query.search?.toString();
  const teacher = req.query.teacher?.toString();

  const tests = await testsService.get(discipline, category, search, teacher);
  res.send(tests);
}

const testsController = {
  insert,
  get,
};
export default testsController;
