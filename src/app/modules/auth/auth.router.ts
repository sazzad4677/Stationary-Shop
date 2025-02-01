import express from 'express';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import validateData from '../../middleware/validateData';
import auth from '../../middleware/auth';
import { UserRole } from '../users/users.constant';

const router = express.Router();

router.post(
  '/register',
  validateData(AuthValidation.registerUserSchema),
  AuthController.registerUser,
);

router.post(
  '/login',
  validateData(AuthValidation.loginUserSchema),
  AuthController.loginUser,
);
router.post(
  '/logout',
  auth(UserRole.USER, UserRole.ADMIN),
  AuthController.logoutUser,
);
router.post(
  '/refresh-token',
  AuthController.refreshToken,
);

export const AuthRouter = router;
