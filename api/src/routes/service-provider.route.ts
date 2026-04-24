import {Router} from "express";
import {ServiceProviderController} from "../controllers/service-provider.controller";
import {authenticate} from "../middlewares/authenticate";
import {authorize} from "../middlewares/authorize";
import {Role} from "../enums/role.enum";

const router = Router();

router.get('/', authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.EMPLOYEE), ServiceProviderController.getAll);
router.post('/', authorize(Role.ADMIN), ServiceProviderController.createServiceProvider);
router.get('/:id', authorize(Role.ADMIN, Role.EMPLOYEE), ServiceProviderController.getById);
// router.delete('/:id', authorize(Role.ADMIN), ServiceProviderController.deleteServiceProvider);
router.put('/:id', authorize(Role.ADMIN), ServiceProviderController.updateServiceProvider);

export default router;