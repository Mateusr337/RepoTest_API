import path, { dirname } from "path";
import multer, { FileFilterCallback } from "multer";
import crypto from "crypto";
import { Request } from "express";
import errors from "../utils/errorFunctions.js";
import { fileURLToPath } from "url";

const multerConfig = {
  storage: multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: any) => {
      cb(null, path.resolve(dirname(""), "src", "uploads"));
    },
    filename: (req: Request, file: Express.Multer.File, cb: any) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const fileName = `${hash.toString("hex")}-${file.originalname}`;
        cb(null, fileName);
      });
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedMimes = ["image/png", "image/jpeg", "application/pdf"];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      throw errors.badRequestError("file type");
    }
  },
};

export default multerConfig;
