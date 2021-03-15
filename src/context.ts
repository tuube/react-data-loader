import { createContext } from 'react';

export interface IDataLoaderContext {
  dataSources: string[] | undefined;
}

const context = createContext<IDataLoaderContext>({
  dataSources: undefined,
});

export default context;