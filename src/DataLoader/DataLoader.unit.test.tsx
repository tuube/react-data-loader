import DataLoader, { DataSourceConfig } from "./";
import DataSource from "./DataSource";

type DataModel = {
  test1: string;
  test2: number;
};

describe("DataLoader", () => {
  const action = jest.fn();
  const subscriber = jest.fn();
  let dataLoader: DataLoader<DataModel>;

  const sources: DataSourceConfig<DataModel> = {
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

  it("sets up correct datasources", () => {
    expect(dataLoader["dataSources"].length).toEqual(2);
    expect(dataLoader["dataSources"][0].name).toEqual("test1");
    expect(dataLoader["dataSources"][1].name).toEqual("test2");
  });

  it("routes values to subscribers", () => {
    dataLoader.addSubscriber("test1", (value) => {
      subscriber(value + "_1");
    });
    dataLoader.addSubscriber("test1", (value) => {
      subscriber(value + "_2");
    });
    dataLoader.addSubscriber("test1", (value) => {
      subscriber(value + "_3");
    });

    expect(subscriber).toBeCalledTimes(3);
    expect(subscriber).toBeCalledWith("test1_1");
    expect(subscriber).toBeCalledWith("test1_2");
    expect(subscriber).toBeCalledWith("test1_3");
  });

  it("creates new ids for subscribers", () => {
    for (let i = 0; i < 100; i++) {
      dataLoader.addSubscriber("test1", (value) => {
        subscriber(value + "_" + i);
      });
    }
    expect(dataLoader["freeIds"].length).toEqual(0);
    expect(dataLoader["nextId"]).toEqual(100);
  });

  it("freed ids of removed subscribers", () => {
    for (let i = 0; i < 10; i++) {
      dataLoader.addSubscriber("test1", (value) => {
        subscriber(value + "_" + i);
      });
    }
    dataLoader.removeSubscriber(5);
    dataLoader.removeSubscriber(6);

    expect(dataLoader["freeIds"]).toEqual([5, 6]);
  });

  it("uses freed ids for new subscribers", () => {
    for (let i = 0; i < 10; i++) {
      dataLoader.addSubscriber("test1", (value) => {
        subscriber(value + "_" + i);
      });
    }
    dataLoader.removeSubscriber(5);
    dataLoader.removeSubscriber(6);

    const id1 = dataLoader.addSubscriber("test1", (value) => {
      subscriber(value);
    });
    const id2 = dataLoader.addSubscriber("test1", (value) => {
      subscriber(value);
    });

    expect(dataLoader["freeIds"].length).toEqual(0);
    expect(id1).toEqual(5);
    expect(id2).toEqual(6);
  });

  it("starts a dataSource on the first added subscriber", () => {
    let spy = jest.spyOn(dataLoader["dataSources"][0], "start");

    dataLoader.addSubscriber("test1", (value) => {
      subscriber(value);
    });

    expect(spy).toBeCalled();
  });

  it("doesn't stop a dataSource if all subscribers are not removed", () => {
    let spy = jest.spyOn(dataLoader["dataSources"][0], "stop");

    const createdSubscriptions = Array(3)
      .fill(null)
      .map((_, i) =>
        dataLoader.addSubscriber("test1", (value) => {
          subscriber(value + "_" + i);
        })
      );

    createdSubscriptions.slice(0, 2).forEach((i) => {
      dataLoader.removeSubscriber(i!);
    });

    expect(spy).not.toBeCalled();
  });

  it("stops a dataSource if all its subscribers are removed", () => {
    let spy = jest.spyOn(dataLoader["dataSources"][0], "stop");

    const createdSubscriptions = Array(3)
      .fill(null)
      .map((_, i) =>
        dataLoader.addSubscriber("test1", (value) => {
          subscriber(value + "_" + i);
        })
      );

    createdSubscriptions.forEach((i) => {
      dataLoader.removeSubscriber(i!);
    });

    expect(spy).toBeCalled();
  });

  it('logs if logging is set up in config', () => {
    const spy = jest.spyOn(console, 'log');

    dataLoader = new DataLoader(sources, {
      log: true,
    });

    dataLoader['log']('test');

    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith('DataLoader:', 'test');
    spy.mockClear();
  });

  it("doesn't logs if logging is not set up in config", () => {
    const spy = jest.spyOn(console, 'log');

    dataLoader['log']('test');

    expect(spy).not.toBeCalled();
    spy.mockClear();
  });
});
