import express from 'express';
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { asyncHandler } from '../middleware/asyncHandler';

// create router
const router = express.Router();

// initialize dependencies
const userService = new UserService();
const userController = new UserController(userService);



// define routes
router.route('/')
  .get(asyncHandler(userController.getAllUser.bind(userController)))
  .post(asyncHandler(userController.createUser.bind(userController)));
router.route('/:id')
  .get(asyncHandler(userController.getUserById.bind(userController)))
  .put(asyncHandler(userController.updateUser.bind(userController)))
  .delete(asyncHandler(userController.deleteUser.bind(userController)));

export default router;