import { Router, type IRouter } from "express";
import healthRouter from "./health";
import medicinesRouter from "./medicines";
import categoriesRouter from "./categories";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import prescriptionsRouter from "./prescriptions";
import adminRouter from "./admin";
import healthTipsRouter from "./health-tips";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(medicinesRouter);
router.use(categoriesRouter);
router.use(cartRouter);
router.use(ordersRouter);
router.use(prescriptionsRouter);
router.use(adminRouter);
router.use(healthTipsRouter);
router.use(authRouter);

export default router;
