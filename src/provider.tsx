import React from 'react';
import DataContext from './context';
import DataLoader from './DataLoader';
import DataSource from './DataLoader/DataSource';

interface IDataLoaderProviderProps {
  children: React.ReactNode;
  dataSources: DataSource<unknown>[];
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