import React from 'react';
import DataContext, { IDataLoaderContext } from './context';

export interface IDataLoaderContextProps {
  children: React.ReactNode;
}

const DataLoaderProvider = ({ children }: IDataLoaderContextProps): React.ReactElement => {
  const state: IDataLoaderContext = {
    dataSources: undefined,
  };

  return (
    <DataContext.Provider value={state}>
      {children}
    </DataContext.Provider>
  )
};

export default DataLoaderProvider;