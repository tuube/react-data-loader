import React from "react";
import createDataLoaderContext from "./context";
import DataLoader, { DataLoaderConfig, DataSourceConfig } from "./DataLoader";

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

type DataLoaderProviderAndContext<DATA_MODEL> = {
  provider: (props: DataLoaderProviderProps) => React.ReactElement;
  context: React.Context<DataLoader<DATA_MODEL> | undefined>;
};

export default function createDataLoaderProviderAndContext<DATA_MODEL>(
  dataSources: DataSourceConfig<DATA_MODEL>,
  config?: DataLoaderConfig,
): DataLoaderProviderAndContext<DATA_MODEL> {
  const context = createDataLoaderContext<DATA_MODEL>();

  return { provider: createDataLoaderProvider(dataSources, context, config), context };
}
