import { Router } from "express";
import disciplineController from "../controllers/disciplineControler.js";
import validateAuth from "../middlewares/validateAuthenticatedMiddleware.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import disciplineSchema from "../schemas/disciplineSchema.js";

const disciplinesRouter = Router();

disciplinesRouter.post(
  "/disciplines",
  validateAuth,
  validateSchemaMiddleware(disciplineSchema),
  disciplineController.insert
);

export default disciplinesRouter;
