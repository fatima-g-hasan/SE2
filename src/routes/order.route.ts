import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { OrderManagementService } from "../services/orderManagement.service";
import { asyncHandler } from "../middleware/asyncHandler";

const orderController = new OrderController(new OrderManagementService());

const route = Router();

// setup paths and methods
route.route('/')
  .get(asyncHandler(orderController.getOrders.bind(orderController)))
  .post(asyncHandler(orderController.createOrder.bind(orderController)));


route.route('/:id')
  .get(asyncHandler(orderController.getOrder.bind(orderController)))
  .put(asyncHandler(orderController.createOrder.bind(orderController)))
  .delete(asyncHandler(orderController.deleteOrder.bind(orderController)));

export default route;