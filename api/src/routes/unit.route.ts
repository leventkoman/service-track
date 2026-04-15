import {Router} from "express";
import {UnitController} from "../controls/unit.controller";
import {roleMatch} from "../helpers/utils";
import {authorize} from "../middlewares/authorize";
import {Role} from "../enums/role.enum";

const router = Router();

router.get("/", authorize(Role.ADMIN, Role.SUPER_ADMIN, Role.EMPLOYEE), UnitController.getAllUnits);

export default router;