import { Context, createContext } from "react";
import DataLoader from "./DataLoader";

const createDataLoaderContext = <DATA_MODEL>(dataSources?: DataLoader<DATA_MODEL>) => {
  return createContext<DataLoader<DATA_MODEL> | undefined>(dataSources);
}

export default createDataLoaderContext;

