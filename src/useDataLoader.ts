/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import dataLoaderContext from "./context";
import DataLoader from './DataLoader';

const useDataLoader = <T>(dataSource: keyof DataLoader['dataSourceConfig']): T => {
  const dataLoader = useContext(dataLoaderContext);
  if (dataLoader === undefined) {
    throw new Error(
      "useDataLoaderContext must be used within DataLoaderProvider"
    );
  }

  const [value, setValue] = useState<unknown>();

  useEffect(() => {
    const sub = dataLoader.addSubscriber(dataSource, setValue);
    return () => {
      if (sub !== undefined) dataLoader.removeSubscriber(sub);
    };
  }, []);

  return (value as unknown) as T;
};

export default useDataLoader;
