import DataSource from "./DataSource";

describe("DataSource", () => {
  const updateFn = jest.fn();
  const stopFn = jest.fn();

  afterEach(() => {
    updateFn.mockClear();
    stopFn.mockClear();
  });

  it("initializes", () => {
    const ds = new DataSource("test1", () => {
      return () => {};
    });

    expect(ds).toBeInstanceOf(DataSource);
  });

  it("passes update function to the action", () => {
    const ds = new DataSource("test1", (update, data) => {
      update('test');
      return () => {};
    });

    ds.start(updateFn);

    expect(updateFn).toBeCalledTimes(1);
    expect(updateFn).toBeCalledWith('test');
  });

  it("sets up stop function and calls it on stop()", () => {
    const ds = new DataSource("test1", (update) => {
      update('test');
      return updateFn;
    });


    ds.start(() => {});
    ds.stop();

    expect(updateFn).toBeCalledTimes(1);
  });
});
