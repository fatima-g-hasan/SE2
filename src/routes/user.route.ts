import express from 'express';
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/UserManagement.service";
import { asyncHandler } from '../middleware/asyncHandler';
import { authenticate } from '../middleware/auth';

// create router
const router = express.Router();

// initialize dependencies
const userService = new UserService();
const userController = new UserController(userService);



// define routes
router.route('/')
  .get(authenticate, asyncHandler(userController.getAllUser.bind(userController)))
  .post(asyncHandler(userController.createUser.bind(userController)));
router.route('/:id')
  .get(authenticate, asyncHandler(userController.getUserById.bind(userController)))
  .put(authenticate, asyncHandler(userController.updateUser.bind(userController)))
  .delete(authenticate, asyncHandler(userController.deleteUser.bind(userController)));

export default router;