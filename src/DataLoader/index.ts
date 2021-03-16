import DataSource from './DataSource';
import Subscriber from './Subscriber';

interface ISubscription {
  subscriber: Subscriber;
  dataSource: DataSource;
}

export default class DataLoader {
  private dataSources: DataSource[];
  private subscriptions: ISubscription[] = [];

  constructor(dataSources: DataSource[]) {
    this.dataSources = dataSources;
  }

  addSubscriber(dataSource: DataSource['name']) {
    const foundDataSource = this.dataSources.find((ds) => ds.name === dataSource);

    if (foundDataSource === undefined) {
      console.warn('DataSource', dataSource, 'is not set up');
      return;
    }
    
    const newSubscriber = new Subscriber();
    this.subscriptions.push({
      subscriber: newSubscriber,
      dataSource: foundDataSource,
    });
  }
}