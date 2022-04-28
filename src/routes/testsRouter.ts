import { Router } from "express";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import testSchema from "../schemas/testSchema.js";
import multer from "multer";
import validateAuth from "../middlewares/validateAuthenticatedMiddleware.js";
import multerConfig from "../middlewares/multerMiddleware.js";
import testsController from "../controllers/testsController.js";

const testsRouter = Router();

testsRouter.post(
  "/tests",
  validateAuth,
  multer(multerConfig).single("pdf"),
  validateSchemaMiddleware(testSchema),
  testsController.insert
);
testsRouter.get("/tests", validateAuth, () => {});

export default testsRouter;
