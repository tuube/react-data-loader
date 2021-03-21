import React from "react";
import GetDataContext from "./context";
import DataLoader, { DataSourceConfig } from "./DataLoader";

interface IDataLoaderProviderProps<DATA_MODEL> {
  children: React.ReactNode;
  dataSources: DataSourceConfig<DATA_MODEL>;
}

function DataLoaderProvider<DATA_MODEL>({
  dataSources,
  children,
}: IDataLoaderProviderProps<DATA_MODEL>): React.ReactElement {
  const dataLoader = new DataLoader(dataSources);

  const Context = GetDataContext<DATA_MODEL>();

  return <Context.Provider value={dataLoader}>{children}</Context.Provider>;
}

export default DataLoaderProvider;
