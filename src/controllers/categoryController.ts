import { Request, Response } from "express";
import categoryService from "../services/categoryService.js";

async function insert(req: Request, res: Response) {
  await categoryService.insert(req.body.name);
  res.sendStatus(201);
}

const categoryController = {
  insert,
};
export default categoryController;
