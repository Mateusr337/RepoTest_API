import { Router } from "express";
import categoryRouter from "./categoryRouter.js";
import disciplinesRouter from "./disciplinesRouter.js";
import teachersRouter from "./teachersRouter.js";
import userRouter from "./userRouter.js";

const router = Router();

router.use(userRouter);
router.use(disciplinesRouter);
router.use(teachersRouter);
router.use(categoryRouter);

export default router;
