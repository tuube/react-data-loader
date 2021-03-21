import { Context, createContext } from "react";
import DataLoader from "./DataLoader";

let context: Context<any>;

const getDataLoaderContext = <DATA_MODEL>() => {
  if (context !== undefined) {
    return context;
  }
  context = createContext<DataLoader<DATA_MODEL> | undefined>(undefined);
  return context;
};

export default getDataLoaderContext;
