import {Router} from "express";
import {VatRateController} from "../controllers/vat-rate.controller";
import {authorize} from "../middlewares/authorize";
import {Role} from "../enums/role.enum";

const router = Router();

router.get('/', authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.EMPLOYEE), VatRateController.getAll);

export default router;