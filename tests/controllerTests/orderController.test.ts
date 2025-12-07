import { OrderController } from "../../src/controllers/order.controller";
import { BadRequestException } from "../../src/util/exceptions/http/BadRequestException";
import { JsonRequestOrderMapper } from "../../src/mappers/Order.mapper";
import { IdentifiableOrderItem } from "../../src/model/Order.model";


jest.mock("../../src/mappers/Order.mapper");

describe("OrderController", () => {
  let controller: OrderController;
  let service: any;
  let mapperMock: jest.Mocked<JsonRequestOrderMapper>;

  beforeEach(() => {
    service = {
      createOrder: jest.fn(),
      getOrder: jest.fn(),
      getAllOrders: jest.fn(),
      updateOrder: jest.fn(),
      deleteOrder: jest.fn(),
    };

    controller = new OrderController(service);

    mapperMock = new JsonRequestOrderMapper({ map: jest.fn() } as any) as jest.Mocked<JsonRequestOrderMapper>;
    (JsonRequestOrderMapper as jest.Mock).mockImplementation(() => mapperMock);

    jest.clearAllMocks();
  });


  // create order
  describe("createOrder", () => {
    it("should create order successfully", async () => {
      const fakeOrder = { getId: () => "1" } as unknown as IdentifiableOrderItem;
      mapperMock.map.mockReturnValue(fakeOrder);
      service.createOrder.mockResolvedValue(fakeOrder);

      const req: any = { body: { category: "cake", item: {} } };
      const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await controller.createOrder(req, res);

      expect(mapperMock.map).toHaveBeenCalledWith(req.body);
      expect(service.createOrder).toHaveBeenCalledWith(fakeOrder);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeOrder);
    });

    it("should throw BadRequestException if order is null", async () => {
      mapperMock.map.mockReturnValue(null as unknown as IdentifiableOrderItem);
      const req: any = { body: { category: "cake" } };
      const res: any = {};

      await expect(controller.createOrder(req, res)).rejects.toThrow(BadRequestException);
    });
  });

  // get order
  describe("getOrder", () => {
    it("should return an order successfully", async () => {
      const fakeOrder = { id: "1" };
      service.getOrder.mockResolvedValue(fakeOrder);

      const req: any = { params: { id: "1" } };
      const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await controller.getOrder(req, res);

      expect(service.getOrder).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeOrder);
    });

    it("should throw BadRequestException if id is missing", async () => {
      const req: any = { params: {} };
      const res: any = {};

      await expect(controller.getOrder(req, res)).rejects.toThrow(BadRequestException);
    });
  });


  // get all orders
  describe("getOrders", () => {
    it("should return all orders", async () => {
      const fakeOrders = [{ id: "1" }, { id: "2" }];
      service.getAllOrders.mockResolvedValue(fakeOrders);

      const req: any = {};
      const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await controller.getOrders(req, res);

      expect(service.getAllOrders).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeOrders);
    });
  });


  // update order
  describe("updateOrder", () => {
    it("should throw BadRequestException if id is missing", async () => {
      const req: any = { params: {}, body: {} };
      const res: any = {};
      await expect(controller.updateOrder(req, res)).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException if order mapping fails", async () => {
      const req: any = { params: { id: "1" }, body: { category: "cake" } };
      mapperMock.map.mockReturnValue(null as unknown as IdentifiableOrderItem);
      const res: any = {};
      await expect(controller.updateOrder(req, res)).rejects.toThrow(BadRequestException);
    });

    it("should throw BadRequestException if id mismatch", async () => {
      const req: any = { params: { id: "1" }, body: { category: "cake" } };
      const fakeOrder = { getId: () => "999" } as unknown as IdentifiableOrderItem;
      mapperMock.map.mockReturnValue(fakeOrder);
      const res: any = {};

      await expect(controller.updateOrder(req, res)).rejects.toThrow(BadRequestException);
    });

    it("should update an order successfully", async () => {
      const req: any = { params: { id: "1" }, body: { category: "cake" } };
      const fakeOrder = { getId: () => "1" } as unknown as IdentifiableOrderItem;
      mapperMock.map.mockReturnValue(fakeOrder);

      const updatedOrder = { id: "1" };
      service.updateOrder.mockResolvedValue(updatedOrder);

      const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      await controller.updateOrder(req, res);

      expect(mapperMock.map).toHaveBeenCalledWith(req.body);
      expect(service.updateOrder).toHaveBeenCalledWith(fakeOrder);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedOrder);
    });
  });


  // delete order
  describe("deleteOrder", () => {
    it("should delete order successfully", async () => {
      const req: any = { params: { id: "1" } };
      const res: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      service.deleteOrder.mockResolvedValue(undefined);

      await controller.deleteOrder(req, res);

      expect(service.deleteOrder).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should throw BadRequestException if id is missing", async () => {
      const req: any = { params: {} };
      const res: any = {};

      await expect(controller.deleteOrder(req, res)).rejects.toThrow(BadRequestException);
    });
  });
});
