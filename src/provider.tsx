import React from "react";
import createDataLoaderContext from "./context";
import DataLoader, { DataLoaderConfig, DataSourceConfig } from "./DataLoader";
import createDataSourceHook, { DataSourceHook } from "./dataSourceHook";

type DataLoaderProviderProps = {
  children: React.ReactNode;
};

function createDataLoaderProvider<DATA_MODEL>(
  dataSources: DataSourceConfig<DATA_MODEL>,
  Context: React.Context<DataLoader<DATA_MODEL> | undefined>,
  dataLoaderConfig?: DataLoaderConfig,
) {
  return function DataLoaderProvider({
    children,
  }: DataLoaderProviderProps): React.ReactElement {
    const dataLoader = new DataLoader(dataSources, dataLoaderConfig);

    return <Context.Provider value={dataLoader}>{children}</Context.Provider>;
  };
}

type DataLoaderProviderAndHook<DATA_MODEL> = {
  provider: (props: DataLoaderProviderProps) => React.ReactElement;
  hook: DataSourceHook<keyof DATA_MODEL>;
};

export default function createDataLoaderProviderAndHook<DATA_MODEL>(
  dataSources: DataSourceConfig<DATA_MODEL>,
  config?: DataLoaderConfig,
): DataLoaderProviderAndHook<DATA_MODEL> {
  const context = createDataLoaderContext<DATA_MODEL>();

  return { provider: createDataLoaderProvider(dataSources, context, config), hook: createDataSourceHook(context) };
}
