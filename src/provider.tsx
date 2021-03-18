import React from 'react';
import DataContext from './context';
import DataLoader, { DataSourceConfig } from './DataLoader';
import DataSource from './DataLoader/InternalDataSource';

interface IDataLoaderProviderProps {
  children: React.ReactNode;
  dataSources: DataSourceConfig;
}

const DataLoaderProvider = ({ dataSources, children }: IDataLoaderProviderProps): React.ReactElement => {
  const dataLoader = new DataLoader(dataSources);

  return (
    <DataContext.Provider value={dataLoader}>
      {children}
    </DataContext.Provider>
  )
};

export default DataLoaderProvider;