import express from 'express';
import { UserController } from './users.controller';
import auth from '../../middleware/auth';
import { UserRole } from './users.constant';

const router = express.Router();

router.get('/', UserController.getAllUser);
router.get("/me", auth(UserRole.USER, UserRole.ADMIN), UserController.getMyProfile)

export const UsersRouter = router;