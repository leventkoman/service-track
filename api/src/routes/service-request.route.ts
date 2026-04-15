import {Router} from "express";
import {authorize} from "../middlewares/authorize";
import {Role} from "../enums/role.enum";
import {ServiceRequestController} from "../controls/service-request.controller";

const router = Router();

router.get('/', authorize(Role.ADMIN, Role.EMPLOYEE), ServiceRequestController.getAll);
router.post('/', authorize(Role.ADMIN, Role.EMPLOYEE), ServiceRequestController.createServiceRequest);
router.get('/:id', authorize(Role.ADMIN, Role.EMPLOYEE), ServiceRequestController.getServiceRequestById);
// router.delete('/:id', authorize(Role.ADMIN, Role.EMPLOYEE), ServiceRequestController.deleteServiceRequest);
router.put('/:id', authorize(Role.ADMIN, Role.EMPLOYEE), ServiceRequestController.updateServiceRequest);

export default router;