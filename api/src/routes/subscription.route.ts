import {Router} from "express";
import {SubscriptionController} from "../controls/subscription.controller";
import {authorize} from "../middlewares/authorize";
import {Role} from "../enums/role.enum";

const router = Router();

router.get('/', authorize(Role.SUPER_ADMIN), SubscriptionController.getSubscriptions);
router.post('/changePlanType', authorize(Role.SUPER_ADMIN), SubscriptionController.changePlan);

export default router;