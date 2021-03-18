import { DataSourceConfig } from "react-data-loader";


const dataSources: DataSourceConfig = {
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
      update(`test #${num++}`);
    }, 1000);
  
    return () => {
      clearInterval(interval);
    };
  },
};

export default dataSources;
