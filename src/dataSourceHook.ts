/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import DataLoader, { DataSourceModel } from "./DataLoader";

/**
 * Hook for listening to a data source
 * @param dataSource The data source to listen
 * @param sideEffect Optional side-effect to run when a new value is gotten
 * @returns The new value from the data source
 */
export interface DataSourceHook<MODEL extends DataSourceModel> {
  <KEY extends keyof MODEL>(
    dataSource: KEY,
    sideEffect?: (value: MODEL[KEY] | null) => void
  ): MODEL[KEY] | null;
}

/**
 * Creates a hook that can be used for listening to a data source
 * @param context The DataLoader context
 * @returns A hook for listening to a data source
 */
const createDataSourceHook = <MODEL extends DataSourceModel>(
  context: React.Context<DataLoader<MODEL> | undefined>
): DataSourceHook<MODEL> => {
  return <KEY extends keyof MODEL>(
    dataSource: KEY,
    sideEffect?: (value: MODEL[KEY] | null) => void
  ): MODEL[KEY] | null => {
    const dataLoader = useContext(context);

    if (dataLoader === undefined) {
      throw new Error("useDataSource must be used within DataLoaderProvider");
    }

    const [value, setValue] = useState<MODEL[KEY] | null>(null);

    useEffect(() => {
      try {
        const sub = dataLoader.addSubscriber(dataSource, setValue);
        return () => {
          dataLoader.removeSubscriber(sub);
        };
      } catch (error) {
        console.error(error);
      }
    }, []);

    useEffect(() => {
      if (sideEffect) {
        sideEffect(value);
      }
    }, [value]);

    return value;
  };
};
export default createDataSourceHook;
