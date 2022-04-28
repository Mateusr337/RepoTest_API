import { Request, Response } from "express";
import categoryService from "../services/categoryService.js";

async function insert(req: Request, res: Response) {
  await categoryService.insert(req.body.name);
  res.sendStatus(201);
}

async function get(req: Request, res: Response) {
  const categories = await categoryService.get();
  res.send(categories);
}

const categoryController = {
  insert,
  get,
};
export default categoryController;
