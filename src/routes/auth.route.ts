import express from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthenticationService } from '../services/Authentication.service';
import { UserService } from '../services/UserManagement.service';
import { AuthenticationController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

// create router
const router = express.Router();

// initialize dependencies
const authService = new AuthenticationService();
const userService = new UserService();

const authController = new AuthenticationController(authService, userService);

// define routes
router.route('/login')
  .post(asyncHandler(authController.login.bind(authController)));

router.route('/logout')
  .get(authenticate, authController.logout.bind(authController));



export default router;