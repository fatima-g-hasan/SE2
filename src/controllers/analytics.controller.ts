import { OrderManagementService } from "../services/orderManagement.service";
import { Request, Response} from "express";

export class AnalyticsController {
  constructor(private readonly orderService: OrderManagementService) {}

  // total revenue
  public async getTotalRevenue(req: Request, res: Response) {
    const revenue = await this.orderService.getTotalRevenue();
    res.status(200).json({ totalRevenue: revenue });
  }

  // revenue by type
  public async getRevenueByItemType(req: Request, res: Response) {
    const revenueMap = await this.orderService.getRevenueByItemType();
    res.status(200).json({ revenueByType: revenueMap });
  }

  // total orders
  public async getTotalOrders(req: Request, res: Response) {
    const count = await this.orderService.getTotalOrders();
    res.status(200).json({ totalOrders: count });
  }

  // orders by type
  public async getOrdersByItemType(req: Request, res: Response) {
    const countMap = await this.orderService.getOrdersByItemType();
    res.status(200).json({ orderByType: countMap });
  }
}