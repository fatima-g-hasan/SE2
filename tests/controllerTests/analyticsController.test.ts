import { Request, Response } from "express";
import { AnalyticsController } from "../../src/controllers/analytics.controller";
import { OrderManagementService } from "../../src/services/orderManagement.service";

describe ("AnalyticsController - getTotalRevenue", () => {
  let controller: AnalyticsController;
  let mockService: jest.Mocked<OrderManagementService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    mockService = {
      getTotalRevenue: jest.fn(),
    } as any;

    controller = new AnalyticsController(mockService);
    
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    
    jest.clearAllMocks();
  });


  it("should return total revenue successfully", async () => {
    const totalRevenue = 45299.50;
    mockService.getTotalRevenue.mockResolvedValue(totalRevenue);

    await controller.getTotalRevenue(req as Request, res as Response);

    expect(mockService.getTotalRevenue).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({ totalRevenue });
  });


  it("should throw if service throws an error", async () => {
    const error = new Error("Service error");
    mockService.getTotalRevenue.mockRejectedValue(error);

    await expect(controller.getTotalRevenue(req as Request, res as Response))
      .rejects.toThrow("Service error");

    expect(mockService.getTotalRevenue).toHaveBeenCalled();
  });
})


describe("AnalyticsController - getRevenueByItemType", () => {
  let controller: AnalyticsController;
  let mockService: jest.Mocked<OrderManagementService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    mockService = {
      getRevenueByItemType: jest.fn(),
    } as any;

    controller = new AnalyticsController(mockService);

    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });


  it("should return revenue by item type successfully", async () => {
    const revenueMap = {
      cake: 32000.5,
      book: 5500.0,
      toy: 7800.25,
    };

    mockService.getRevenueByItemType.mockResolvedValue(revenueMap);

    await controller.getRevenueByItemType(req as Request, res as Response);

    expect(mockService.getRevenueByItemType).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ revenueByType: revenueMap });
  });


  it("should throw if service throws an error", async () => {
    const error = new Error("Service error");
    mockService.getRevenueByItemType.mockRejectedValue(error);

    await expect(controller.getRevenueByItemType(req as Request, res as Response))
      .rejects.toThrow("Service error");

    expect(mockService.getRevenueByItemType).toHaveBeenCalled();
  });
});


describe("AnalyticsController - getTotalOrders", () => {
  let controller: AnalyticsController;
  let mockService: jest.Mocked<OrderManagementService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    mockService = {
      getTotalOrders: jest.fn(),
    } as any;

    controller = new AnalyticsController(mockService);

    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should return total orders successfully", async () => {
    mockService.getTotalOrders.mockResolvedValue(1200);

    await controller.getTotalOrders(req as Request, res as Response);

    expect(mockService.getTotalOrders).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ totalOrders: 1200 });
  });

  it("should throw if service throws an error", async () => {
    const error = new Error("Service error");
    mockService.getTotalOrders.mockRejectedValue(error);

    await expect(controller.getTotalOrders(req as Request, res as Response))
      .rejects.toThrow("Service error");

    expect(mockService.getTotalOrders).toHaveBeenCalled();
  });
});

describe("AnalyticsController - getOrdersByItemType", () => {
  let controller: AnalyticsController;
  let mockService: jest.Mocked<OrderManagementService>;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    mockService = {
      getOrdersByItemType: jest.fn(),
    } as any;

    controller = new AnalyticsController(mockService);

    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("should return orders count by type successfully", async () => {
    const countMap = {
      cake: 120,
      book: 45,
      toy: 78,
    };

    mockService.getOrdersByItemType.mockResolvedValue(countMap);

    await controller.getOrdersByItemType(req as Request, res as Response);

    expect(mockService.getOrdersByItemType).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ orderByType: countMap });
  });

  it("should throw if service throws an error", async () => {
    const error = new Error("Service error");
    mockService.getOrdersByItemType.mockRejectedValue(error);

    await expect(controller.getOrdersByItemType(req as Request, res as Response))
      .rejects.toThrow("Service error");

    expect(mockService.getOrdersByItemType).toHaveBeenCalled();
  });
});