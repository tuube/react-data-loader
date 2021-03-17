import { DataSource } from 'react-data-loader';

const source = new DataSource<string>('test', (update) => {
  let num = 0;
  const interval = setInterval(() => {
    update(`test #${num++}`);
  }, 1000);

  return () => {
    clearInterval(interval);
  };
})

const dataSources = [source];

export default dataSources;