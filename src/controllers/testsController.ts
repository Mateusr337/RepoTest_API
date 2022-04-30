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

async function putViews(req: Request, res: Response) {
  const { views } = req.body;
  const { id } = req.params;

  await testsService.putViews(views.toString() as string, parseInt(id) as number);
  res.sendStatus(204);
}

const testsController = {
  insert,
  get,
  putViews,
};
export default testsController;
