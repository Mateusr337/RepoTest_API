import { Router } from "express";
import categoryController from "../controllers/categoryController.js";
import validateAuth from "../middlewares/validateAuthenticatedMiddleware.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import nameSchema from "../schemas/nameSchema.js";

const categoryRouter = Router();

categoryRouter.get("/categories", validateAuth, categoryController.get);

categoryRouter.post(
  "/categories",
  validateAuth,
  validateSchemaMiddleware(nameSchema),
  categoryController.insert
);

export default categoryRouter;
