import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
import errors from "./utils/errorFunctions.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

app.use(router);
router.use(errors.errorHandlingMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
