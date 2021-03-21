/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import createDataLoaderContext from "./context";
import { DataSourceModel } from "./DataLoader";

const createDataSourceHook = <MODEL extends DataSourceModel>() => <
  KEY extends keyof MODEL
>(
  dataSource: KEY
): MODEL[KEY] | undefined => {
  const dataLoader = useContext(createDataLoaderContext<MODEL>());

  if (dataLoader === undefined) {
    throw new Error(
      "useDataLoaderContext must be used within DataLoaderProvider"
    );
  }

  const [value, setValue] = useState<MODEL[KEY]>();

  useEffect(() => {
    const sub = dataLoader.addSubscriber(dataSource, setValue);
    return () => {
      if (sub !== undefined) dataLoader.removeSubscriber(sub);
    };
  }, []);

  return value;
};

export default createDataSourceHook;
