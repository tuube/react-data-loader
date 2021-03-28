import {
  DataSourceConfig,
  createDataLoaderProviderAndHook,
} from "react-data-loader";

export type AppDataSources = {
  test1: string;
  test2: number;
};

const dataSources: DataSourceConfig<AppDataSources> = {
  test1: (update) => {
    let num = 0;
    const interval = setInterval(() => {
      update(`test #${num++}`);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  },
  test2: (update) => {
    let num = 0;
    const interval = setInterval(() => {
      update(num++);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  },
};

const { hook, provider } = createDataLoaderProviderAndHook(dataSources);
export default provider;

export const useDataSource = hook;
