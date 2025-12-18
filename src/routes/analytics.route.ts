import { Router } from "express";
import { OrderManagementService } from "../services/OrderManagement.service";
import { asyncHandler } from "../middleware/asyncHandler";
import { AnalyticsController } from "../controllers/analytics.controller";

const analyticsController = new AnalyticsController(new OrderManagementService());
const route = Router();

route.get('/orders/total', asyncHandler(analyticsController.getTotalOrders.bind(analyticsController)));

route.get('/orders/item-types', asyncHandler(analyticsController.getOrdersByItemType.bind(analyticsController)));

route.get('/revenue/total', asyncHandler(analyticsController.getTotalRevenue.bind(analyticsController)));

route.get('/revenue/item-types', asyncHandler(analyticsController.getRevenueByItemType.bind(analyticsController)));

export default route;
