import {
  FinanceCalculator,
  Order,
  OrderManagement,
  Validator,
} from "../src/app";

describe("OrderManagement", () => {
  let validator: Validator;
  let calc: FinanceCalculator;
  let orderManager: OrderManagement;
  let baseValidator: (order: Order) => void;

  beforeAll(() => {
    validator = new Validator([]);
    calc = new FinanceCalculator();
  });

  beforeEach(() => {
    baseValidator = validator.validate;
    validator.validate = jest.fn();
    orderManager = new OrderManagement(validator, calc);
  });

  afterEach(() => {
    validator.validate = baseValidator;
  });

  it("should add an order", () => {
    //Arrange
    const validator = new Validator([]);
    const calc = new FinanceCalculator();
    const orderManager = new OrderManagement(validator, calc);
    const item = "Sponge";
    const price = 15;

    //Act
    orderManager.addOrder(item, price);

    //Assert
    expect(orderManager.getOrders()).toEqual([{ id: 1, item, price }]);
  });

  it("should get an order", () => {
    const validator = new Validator([]);
    const calc = new FinanceCalculator();
    const orderManager = new OrderManagement(validator, calc);
    const item = "Sponge";
    const price = 15;
    orderManager.addOrder(item, price);

    orderManager.getOrder(1);

    expect(orderManager.getOrder(1)).toEqual({ id: 1, item, price });
  });

  it("should call finance calculator getRevenue", () => {
    const item = "Sponge";
    const price = 15;
    orderManager.addOrder(item, price);
    const spy = jest.spyOn(calc, "getRevenue");

    orderManager.getTotalRevenue();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith([{ id: 1, item, price }]);
    expect(spy).toHaveReturnedWith(15);
  });

  it("should throw addition exception if validator does not pass", () => {
    const item = "Sponge";
    const price = 10;
    (validator.validate as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid order");
    });

    expect(() => orderManager.addOrder(item, price)).toThrow(
      "[OrderManagement] Error adding order: invalid order"
    );
  });
});

describe("FinanceCalculator", () => {
  it("should get the total revenue", () => {
    const calc = new FinanceCalculator();
    const orders = [
      { id: 1, item: "Sponge", price: 15 },
      { id: 2, item: "Chocolate", price: 10 },
      { id: 3, item: "Fruit", price: 10 },
    ];

    const revenue = calc.getRevenue(orders);

    expect(revenue).toEqual(35);
  });
});
