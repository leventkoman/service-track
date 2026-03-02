import {Router} from "express";
import {UserController} from "../controls/user.controller";
import {authorize} from "../middlewares/authorize";
import {Role} from "../enums/role.enum";

const router = Router();
/* @swagger
* /api/author/{id}:
*   get:
    *     summary: XXXXXXX
*     tags:
*       - Authors
*     parameters:
*       - name: id
*         in: path
*         required: true
*         schema:
*           type: string
*     responses:
*       200:
*         description: Success
*/
router.get('/', authorize(Role.SUPER_ADMIN, Role.ADMIN), UserController.getAll);
router.post('/', authorize(Role.SUPER_ADMIN, Role.ADMIN), UserController.createUser);
router.get('/:id', authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.EMPLOYEE), UserController.getByUserId);
router.delete('/:id', authorize(Role.SUPER_ADMIN, Role.ADMIN), UserController.deleteUserById);
router.put('/:id', authorize(Role.SUPER_ADMIN, Role.ADMIN, Role.EMPLOYEE), UserController.updateUser);

export default router;