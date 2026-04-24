import {Router} from "express";
import {authorize} from "../middlewares/authorize";
import {Role} from "../enums/role.enum";
import {ServiceRequestController} from "../controllers/sevice-request-status.controller";

const router = Router();

router.get('/', authorize(Role.ADMIN, Role.SUPER_ADMIN, Role.EMPLOYEE), ServiceRequestController.getAllStatus);

export default router;