import { Context, createContext } from "react";
import DataLoader from "./DataLoader";

let context: Context<any>;

const getDataLoaderContext = <DATA_MODEL>() => {
  if (context !== undefined) {
    return context;
  }
  context = createDataLoaderContext();
  return context;
};

export const createDataLoaderContext = <DATA_MODEL>(dataSources?: DataLoader<DATA_MODEL>) => {
  return createContext<DataLoader<DATA_MODEL> | undefined>(dataSources);
}

export default getDataLoaderContext;
