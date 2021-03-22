const DataLoader = require("./").default;
const DataSource = require("./DataSource");


describe("DataLoader", () => {
  const action = jest.fn();
  const subscriber = jest.fn();
  let dataLoader;

  const sources = {
    test1: (update) => {
      action("test1");
      update("test1");
      return () => {};
    },
    test2: (update) => {
      action("test2");
      update(1);
    },
  };

  beforeEach(() => {
    dataLoader = new DataLoader(sources, {
      log: false,
    });
  });

  afterEach(() => {
    action.mockClear();
    subscriber.mockClear();
  });

  it("initializes", () => {
    expect(dataLoader).toBeInstanceOf(DataLoader);
  });

  it("throws if a nonexisting dataSource is tried to subscribe to", () => {
    const addBadSubscription = () => dataLoader.addSubscriber("test3", (value) => {
      subscriber(value);
    });
    expect(addBadSubscription).toThrow()
  });
});
