import DataLoader, { DataSourceConfig } from "./";
import DataSource from "./DataSource";

type DataModel = {
  test1: string;
  test2: number;
};

describe("DataLoader", () => {
  const action = jest.fn();

  const sources: DataSourceConfig<DataModel> = {
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
