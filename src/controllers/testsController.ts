import { Request, Response } from "express";
import testsService from "../services/testsService.js";

async function insert(req: Request, res: Response) {
  const file = req.file;
  await testsService.insert(req.body, file);
  res.sendStatus(201);
}

const testsController = {
  insert,
};
export default testsController;
