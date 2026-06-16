import { OrderManagementService } from "../../src/services/orderManagement.service";
import { ItemCategory } from "../../src/model/IItem";
import { ServiceException } from "../../src/util/exceptions/ServiceException";
import { IIdentifiableOrderItem } from "../../src/model/IOrder";
import { BadRequestException } from "../../src/util/exceptions/http/BadRequestException";
import { NotFoundException } from "../../src/util/exceptions/http/NotFoundException";


// Create order
describe("OrderManagementService.createOrder", () => {
  let service: OrderManagementService;
  let fakeRepo: any;

  beforeEach(() => {
    service = new OrderManagementService();

    fakeRepo = {
      create: jest.fn(),
    };

    jest.spyOn(service as any, "getRepo").mockResolvedValue(fakeRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a valid order", async () => {
    const validOrder = {
      getItem: () => ({ getCategory: () => ItemCategory.CAKE }),
      getPrice: () => 10,
      getQuantity: () => 2,
    };

    const result = await service.createOrder(validOrder as any);

    expect(result).toBe(validOrder);
    expect(fakeRepo.create).toHaveBeenCalledWith(validOrder);
  });

  it("should throw BadRequestException for invalid order (no item)", async () => {
    const invalidOrder = {
      getItem: () => null,
      getPrice: () => 10,
      getQuantity: () => 2,
    };

    await expect(service.createOrder(invalidOrder as any)).rejects.toThrow(BadRequestException);
    expect(fakeRepo.create).not.toHaveBeenCalled();
  });

  it("should throw BadRequestException for invalid order (price <= 0)", async () => {
    const invalidOrder = {
      getItem: () => ({ getCategory: () => ItemCategory.CAKE }),
      getPrice: () => 0,
      getQuantity: () => 2,
    };

    await expect(service.createOrder(invalidOrder as any)).rejects.toThrow(BadRequestException);
    expect(fakeRepo.create).not.toHaveBeenCalled();
  });

  it("should throw BadRequestException for invalid order (quantity <= 0)", async () => {
    const invalidOrder = {
      getItem: () => ({ getCategory: () => ItemCategory.CAKE }),
      getPrice: () => 10,
      getQuantity: () => 0,
    };

    await expect(service.createOrder(invalidOrder as any)).rejects.toThrow(BadRequestException);
    expect(fakeRepo.create).not.toHaveBeenCalled();
  });
});


// Get an order
describe("OrderManagementService.getOrder", () => {
  let service: OrderManagementService;
  let mockRepos: Record<string, any>;

  beforeEach(() => {
    service = new OrderManagementService();

    mockRepos = {
      [ItemCategory.CAKE]: { get: jest.fn() },
      [ItemCategory.BOOK]: { get: jest.fn() },
      [ItemCategory.TOY]: { get: jest.fn() },
    };

    jest.spyOn(service as any, "getRepo").mockImplementation(async (category) => {
      return mockRepos[category as ItemCategory];
    });
  });

  afterEach(() => jest.clearAllMocks());

  it("should return an order if repo of first category finds it", async () => {
    const fakeOrder = { id: "123" };

    mockRepos[ItemCategory.CAKE].get.mockResolvedValue(fakeOrder);
    mockRepos[ItemCategory.BOOK].get.mockResolvedValue(null);
    mockRepos[ItemCategory.TOY].get.mockResolvedValue(null);

    const result = await service.getOrder("123");

    expect(result).toBe(fakeOrder);
    expect(mockRepos[ItemCategory.CAKE].get).toHaveBeenCalledWith("123");
    expect(mockRepos[ItemCategory.BOOK].get).not.toHaveBeenCalled();
  });

  it("should return an order if a later category repo finds it", async () => {
    const fakeOrder = { id: "999" };

    mockRepos[ItemCategory.CAKE].get.mockResolvedValue(null);
    mockRepos[ItemCategory.BOOK].get.mockResolvedValue(fakeOrder);
    mockRepos[ItemCategory.TOY].get.mockResolvedValue(null);

    const result = await service.getOrder("999");

    expect(result).toBe(fakeOrder);
    expect(mockRepos[ItemCategory.CAKE].get).toHaveBeenCalledWith("999");
    expect(mockRepos[ItemCategory.BOOK].get).toHaveBeenCalledWith("999");
    expect(mockRepos[ItemCategory.TOY].get).not.toHaveBeenCalled();
  });

  it("should throw NotFoundException if no repo contains the order", async () => {
    mockRepos[ItemCategory.CAKE].get.mockResolvedValue(null);
    mockRepos[ItemCategory.BOOK].get.mockResolvedValue(null);
    mockRepos[ItemCategory.TOY].get.mockResolvedValue(null);

    await expect(service.getOrder("not-found"))
      .rejects
      .toThrow(NotFoundException);

    expect(mockRepos[ItemCategory.CAKE].get).toHaveBeenCalledWith("not-found");
    expect(mockRepos[ItemCategory.BOOK].get).toHaveBeenCalledWith("not-found");
    expect(mockRepos[ItemCategory.TOY].get).toHaveBeenCalledWith("not-found");
  });
});


// Update order
describe("OrderManagementService.updateOrder", () => {
  let service: OrderManagementService;

  const mockRepo = {
    update: jest.fn()
  };

  const mockOrder: IIdentifiableOrderItem = {
    getId: () => "order-1",
    getItem: () => ({
      getId: () => "item-1",
      getCategory: () => ItemCategory.CAKE
    }),
    getQuantity: () => 3,
    getPrice: () => 10,
  } as any;

  beforeEach(() => {
    service = new OrderManagementService();

    jest.spyOn(service as any, "validateOrder").mockImplementation(() => {});

    jest.spyOn(service as any, "getRepo")
      .mockImplementation(async () => {
        return mockRepo;
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should validate the order, get the repo, and call repo.update", async () => {
    await service.updateOrder(mockOrder);

    expect((service as any).validateOrder).toHaveBeenCalledWith(mockOrder);

    expect((service as any).getRepo)
      .toHaveBeenCalledWith(ItemCategory.CAKE);

    expect(mockRepo.update).toHaveBeenCalledWith(mockOrder);
  });
});


// Delete order
describe("OrderManagementService.deleteOrder", () => {
  let service: OrderManagementService;

  const mockOrder = { id: "order-1" } as any;

  const repoCake = {
    get: jest.fn(),
    delete: jest.fn()
  };

  const repoBook = {
    get: jest.fn(),
    delete: jest.fn()
  };

  const repoToy = {
    get: jest.fn(),
    delete: jest.fn()
  };

  const mockRepos: Record<ItemCategory, any> = {
    [ItemCategory.CAKE]: repoCake,
    [ItemCategory.BOOK]: repoBook,
    [ItemCategory.TOY]: repoToy
  };

  beforeEach(() => {
    service = new OrderManagementService();

    repoCake.get.mockReset();
    repoCake.delete.mockReset();
    repoBook.get.mockReset();
    repoBook.delete.mockReset();
    repoToy.get.mockReset();
    repoToy.delete.mockReset();

    jest.spyOn(service as any, "getRepo").mockImplementation(async (category) => {
      return mockRepos[category as ItemCategory];
    });
  });

  it("should delete the order when found in one of the repos", async () => {
    repoCake.get.mockResolvedValue(null);
    repoBook.get.mockResolvedValue(mockOrder);
    repoToy.get.mockResolvedValue(null);

    await service.deleteOrder("order-1");

    expect(repoCake.get).toHaveBeenCalledWith("order-1");
    expect(repoBook.get).toHaveBeenCalledWith("order-1");

    expect(repoBook.delete).toHaveBeenCalledWith("order-1");

    expect(repoCake.delete).not.toHaveBeenCalled();
    expect(repoToy.delete).not.toHaveBeenCalled();
  });

  it("should throw NotFoundException if order is not found in any repo", async () => {
  repoCake.get.mockResolvedValue(null);
  repoBook.get.mockResolvedValue(null);
  repoToy.get.mockResolvedValue(null);

  await expect(service.deleteOrder("order-1"))
    .rejects
    .toThrow(NotFoundException);

  expect(repoCake.delete).not.toHaveBeenCalled();
  expect(repoBook.delete).not.toHaveBeenCalled();
  expect(repoToy.delete).not.toHaveBeenCalled();
});
});


// Get all orders
describe("OrderManagementService.getAllOrders", () => {
  let service: OrderManagementService;

  const cakeOrders = [
    { id: "c1" } as any,
    { id: "c2" } as any
  ];

  const bookOrders = [
    { id: "b1" } as any
  ];

  const toyOrders = [
    { id: "t1" } as any,
    { id: "t2" } as any,
    { id: "t3" } as any
  ];

  const repoCake = { getAll: jest.fn() };
  const repoBook = { getAll: jest.fn() };
  const repoToy = { getAll: jest.fn() };

  const mockRepos: Record<ItemCategory, any> = {
    [ItemCategory.CAKE]: repoCake,
    [ItemCategory.BOOK]: repoBook,
    [ItemCategory.TOY]: repoToy
  };

  beforeEach(() => {
    service = new OrderManagementService();

    repoCake.getAll.mockReset();
    repoBook.getAll.mockReset();
    repoToy.getAll.mockReset();

     jest.spyOn(service as any, "getRepo").mockImplementation(async (category) => {
      return mockRepos[category as ItemCategory];
    });
  })

  it("should return all orders from all categories", async () => {
    repoCake.getAll.mockResolvedValue(cakeOrders);
    repoBook.getAll.mockResolvedValue(bookOrders);
    repoToy.getAll.mockResolvedValue(toyOrders);

    const result = await service.getAllOrders();

    expect(result).toEqual([
      ...cakeOrders,
      ...bookOrders,
      ...toyOrders
    ]);

    expect(repoCake.getAll).toHaveBeenCalled();
    expect(repoBook.getAll).toHaveBeenCalled();
    expect(repoToy.getAll).toHaveBeenCalled();
  });
});

// Get total revenue
describe("OrderManagementService.getTotalRevenue", () => {
  let service: OrderManagementService;

  beforeEach(() => {
    service = new OrderManagementService();
  });

  it("should return total revenue from all orders", async () => {
    const mockOrders = [
      { getPrice: () => 10, getQuantity: () => 2 },
      { getPrice: () => 5, getQuantity: () => 4 }, 
      { getPrice: () => 7, getQuantity: () => 1 }
    ];

    jest
      .spyOn(service, "getAllOrders")
      .mockResolvedValue(mockOrders as any);

    const total = await service.getTotalRevenue();

    expect(total).toBe(47); 
    expect(service.getAllOrders).toHaveBeenCalled();
  });
});

// Get revenue by item
describe("OrderManagementService.getRevenueByItemType", () => {
  let service: OrderManagementService;

  beforeEach(() => {
    service = new OrderManagementService();
  });

  it("should return revenue grouped by item type", async () => {
    const mockOrders = [
      {
        getItem: () => ({ getCategory: () => "cake" }),
        getPrice: () => 10,
        getQuantity: () => 2 
      },
      {
        getItem: () => ({ getCategory: () => "cake" }),
        getPrice: () => 5,
        getQuantity: () => 3
      },
      {
        getItem: () => ({ getCategory: () => "book" }),
        getPrice: () => 7,
        getQuantity: () => 1
      }
    ];

    jest
      .spyOn(service, "getAllOrders")
      .mockResolvedValue(mockOrders as any);

    const result = await service.getRevenueByItemType();

    expect(result).toEqual({
      cake: 35,
      book: 7
    });

    expect(service.getAllOrders).toHaveBeenCalled();
  });
});

// get total orders
describe("OrderManagementService.getTotalOrders", () => {
  let service: OrderManagementService;

  beforeEach(() => {
    service = new OrderManagementService();
  });

  it("should return the total number of orders", async () => {
    const mockOrders = [
      { id: "1" },
      { id: "2" },
      { id: "3" }
    ];

    jest
      .spyOn(service, "getAllOrders")
      .mockResolvedValue(mockOrders as any);

    const total = await service.getTotalOrders();

    expect(total).toBe(3);
    expect(service.getAllOrders).toHaveBeenCalled();
  });
});


// count by item
describe("OrderManagementService.getOrdersByItemType", () => {
  let service: OrderManagementService;

  beforeEach(() => {
    service = new OrderManagementService();
  });

  it("should return order counts grouped by item type", async () => {
    const mockOrders = [
      { getItem: () => ({ getCategory: () => "cake" }) },
      { getItem: () => ({ getCategory: () => "cake" }) },
      { getItem: () => ({ getCategory: () => "book" }) },
      { getItem: () => ({ getCategory: () => "toy" }) },
      { getItem: () => ({ getCategory: () => "toy" }) },
      { getItem: () => ({ getCategory: () => "toy" }) }
    ];

    jest.spyOn(service, "getAllOrders")
        .mockResolvedValue(mockOrders as any);

    const result = await service.getOrdersByItemType();

    expect(result).toEqual({
      cake: 2,
      book: 1,
      toy: 3
    });

    expect(service.getAllOrders).toHaveBeenCalled();
  });
});
