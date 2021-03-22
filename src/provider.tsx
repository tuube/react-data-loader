import React from "react";
import GetDataContext, { createDataLoaderContext } from "./context";
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

type DataLoaderProviderWithoutContextProps= {
  children: React.ReactNode;
};

function createDataLoaderProvider<DATA_MODEL>(
  dataSources: DataSourceConfig<DATA_MODEL>,
  Context: React.Context<DataLoader<DATA_MODEL> | undefined>
) {

  return function DataLoaderProviderWithContext({
    children,
  }: DataLoaderProviderWithoutContextProps): React.ReactElement {
    const dataLoader = new DataLoader(dataSources);

    return <Context.Provider value={dataLoader}>{children}</Context.Provider>;
  };
}

export default DataLoaderProvider;

export function create<DATA_MODEL>(
  dataSources: DataSourceConfig<DATA_MODEL>
): [
  (
    props: DataLoaderProviderWithoutContextProps
  ) => React.ReactElement,
  React.Context<DataLoader<DATA_MODEL> | undefined>
] {
  const context = createDataLoaderContext<DATA_MODEL>();

  return [
    createDataLoaderProvider(dataSources, context),
    context,
  ];
}
