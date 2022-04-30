import { Router } from "express";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import testSchema from "../schemas/testSchema.js";
import multer from "multer";
import validateAuth from "../middlewares/validateAuthenticatedMiddleware.js";
import testsController from "../controllers/testsController.js";
import testPutSchema from "../schemas/testPutSchema.js";

const upload = multer({ storage: multer.memoryStorage() });

const testsRouter = Router();

testsRouter.post(
  "/tests",
  validateAuth,
  upload.single("pdf"),
  validateSchemaMiddleware(testSchema),
  testsController.insert
);
testsRouter.put(
  "/tests/:id",
  validateAuth,
  validateSchemaMiddleware(testPutSchema),
  testsController.putViews
);
testsRouter.get("/tests", validateAuth, testsController.get);

export default testsRouter;
