import React from "react";
import createDataLoaderContext from "./context";
import DataLoader, { DataLoaderConfig, DataSourceConfig } from "./DataLoader";
import createDataSourceHook, { DataSourceHook } from "./dataSourceHook";

type DataLoaderProviderProps<DATA_MODEL> = {
  children: React.ReactNode;
  onEvent?: DataLoaderConfig<DATA_MODEL>["onEvent"];
};

function createDataLoaderProvider<DATA_MODEL>(
  dataSources: DataSourceConfig<DATA_MODEL>,
  Context: React.Context<DataLoader<DATA_MODEL> | undefined>,
  dataLoaderConfig?: DataLoaderConfig<DATA_MODEL>
) {
  return function DataLoaderProvider({
    children,
    onEvent,
  }: DataLoaderProviderProps<DATA_MODEL>): React.ReactElement {
    const dataLoader = new DataLoader(dataSources, {
      ...dataLoaderConfig,
      onEvent,
    });

    return <Context.Provider value={dataLoader}>{children}</Context.Provider>;
  };
}

type DataLoaderProviderAndHook<DATA_MODEL> = {
  provider: (props: DataLoaderProviderProps<DATA_MODEL>) => React.ReactElement;
  /** A hook for listening to a data source */
  hook: DataSourceHook<DATA_MODEL>;
};

/**
 * Create a new data loader provider and a hook for using it
 * @param dataSources The data sources for the data loader
 * @param config The config for the data loader
 * @returns An object with a provider and a hook for the created data loader
 */
export default function createDataLoaderProviderAndHook<DATA_MODEL>(
  dataSources: DataSourceConfig<DATA_MODEL>,
  config?: DataLoaderConfig<DATA_MODEL>
): DataLoaderProviderAndHook<DATA_MODEL> {
  const context = createDataLoaderContext<DATA_MODEL>();

  return {
    provider: createDataLoaderProvider(dataSources, context, config),
    hook: createDataSourceHook(context),
  };
}
