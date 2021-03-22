import { DataSourceConfig, createDataSourceHook, create } from "react-data-loader";

export type AppDataSources = {
  test1: string;
  test2: number;
}

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

const ProviderAndContext = create(dataSources);
export default ProviderAndContext;

export const useDataSource = createDataSourceHook<AppDataSources>();
