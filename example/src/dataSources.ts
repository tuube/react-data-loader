import { DataSource } from 'react-data-loader';

const source1 = new DataSource<string>('test1', (update) => {
  let num = 0;
  const interval = setInterval(() => {
    update(`test #${num++}`);
  }, 1000);

  return () => {
    clearInterval(interval);
  };
})

const source2 = new DataSource<string>('test2', (update) => {
  let num = 0;
  const interval = setInterval(() => {
    update(`test #${num++}`);
  }, 1000);

  return () => {
    clearInterval(interval);
  };
})

const dataSources = [source1, source2];

export default dataSources;