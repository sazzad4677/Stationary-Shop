import express from 'express';
import { UserController } from './users.controller';
import auth from '../../middleware/auth';
import { UserRole } from './users.constant';
import validateData from '../../middleware/validateData';
import { UpdateUserSchema } from './users.validation';

const router = express.Router();

router.get('/',auth(UserRole.ADMIN), UserController.getAllUser);
router.get("/me", auth(UserRole.USER, UserRole.ADMIN), UserController.getMyProfile)
router.patch("/me", auth(UserRole.USER, UserRole.ADMIN), validateData(UpdateUserSchema), UserController.updateMyProfile)

export const UsersRouter = router;