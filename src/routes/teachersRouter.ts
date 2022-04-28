import { Router } from "express";
import teachersController from "../controllers/teachersController.js";
import validateAuth from "../middlewares/validateAuthenticatedMiddleware.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import nameSchema from "../schemas/nameSchema.js";

const teachersRouter = Router();

teachersRouter.get("/teachers", validateAuth, teachersController.get);

teachersRouter.post(
  "/teachers",
  validateAuth,
  validateSchemaMiddleware(nameSchema),
  teachersController.insert
);

export default teachersRouter;
