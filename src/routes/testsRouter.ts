import { Router } from "express";
import * as authController from "../controllers/authController.js";
import * as testsController from "../controllers/testsController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import testSchema from "../schemas/testSchema.js";
import multer from "multer";
import supabase from "../supabase.js";
const upload = multer({ dest: "./src/uploads/" });

const testsRouter = Router();

testsRouter.post(
  "/tests",
  // authController.validateToken,
  // validateSchemaMiddleware(testSchema),
  upload.single("file"),
  async (req, res) => {
    const file: any = req.file;
    const { data, error } = await supabase.storage.from("pdfs").upload("file1.pdf", file);
    console.log(data, error);
    console.log(req.body.name);
    res.sendStatus(200);
  }
  // testsController.insert
);
testsRouter.get("/tests", authController.validateToken, testsController.findAll);

export default testsRouter;
