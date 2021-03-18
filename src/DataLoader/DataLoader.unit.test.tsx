import DataLoader, { DataSourceConfig } from "./";
import DataSource from "./InternalDataSource";

describe("DataLoader", () => {
  const action = jest.fn();

  const sources: DataSourceConfig = {
    test1: (update) => {
      action("test1");
      update("");
      return () => {};
    },
    test2: (update) => {
      action("test2");
      update(1);
      return () => {};
    },
  };

  it("initializes", () => {
    const dataLoader = new DataLoader(sources);
  });
});
