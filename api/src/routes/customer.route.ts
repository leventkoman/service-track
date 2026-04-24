import {Router} from "express";
import {CustomerController} from "../controllers/customer.controller";
import {authenticate} from "../middlewares/authenticate";
import {authorize} from "../middlewares/authorize";
import {Role} from "../enums/role.enum";

const router = Router();

router.get('/', authorize(Role.EMPLOYEE, Role.ADMIN, Role.SUPER_ADMIN), CustomerController.getAll);
router.post('/', authorize(Role.ADMIN, Role.EMPLOYEE), CustomerController.createCustomer);
router.get('/:id', authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.EMPLOYEE), CustomerController.getCustomerById);
router.put('/:id', authorize(Role.ADMIN, Role.EMPLOYEE), CustomerController.updateCustomer);
router.delete('/:id', authorize(Role.ADMIN, Role.EMPLOYEE), CustomerController.deleteCustomer);

export default router;