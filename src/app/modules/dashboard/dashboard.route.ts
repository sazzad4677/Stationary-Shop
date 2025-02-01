import express from 'express';
import auth from '../../middleware/auth';
import { UserRole } from '../users/users.constant';
import { DashboardController } from './dashboard.controller';

const router = express.Router();

router.get('/', auth(UserRole.ADMIN), DashboardController.getDashboardInfo);

export const DashboardRouter = router;
