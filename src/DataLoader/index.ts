import DataSource, { IUpdate } from "./DataSource";
import Subscriber from "./Subscriber";

interface ISubscription {
  subscriber: Subscriber["id"];
  dataSource: string;
  updateFunction: IUpdate<unknown>;
}

type SubscriptionData = Pick<ISubscription, "dataSource" | "subscriber">;

export default class DataLoader {
  private dataSources: DataSource<unknown>[] = [];
  private subscriptions: ISubscription[] = [];

  constructor(dataSources: DataSource<unknown>[]) {
    try {
      this.dataSources = this.validateDataSources(dataSources);
    } catch (error) {
      console.error("Failed creating DataLoader:", error);
    }
  }

  log(...args: any[]): any {
    console.log('DataLoader:', ...args);
  }

  addSubscriber(
    dataSource: string,
    updateFunction: IUpdate<unknown>
  ): SubscriptionData {
    const foundDataSource = this.dataSources.find(
      (ds) => ds.name === dataSource
    );

    if (foundDataSource === undefined) {
      throw `Data source ${dataSource} is not set up`;
    }

    const newSubscriber = new Subscriber();
    this.subscriptions.push({
      subscriber: newSubscriber.id,
      dataSource: foundDataSource.name,
      updateFunction,
    });

    this.log('Adding subscriber', newSubscriber.id);

    if (
      this.subscriptions.filter((sub) => sub.dataSource === dataSource)
        .length === 1
    ) {
      foundDataSource.start(this.runUpdates(dataSource));
    }

    return {
      subscriber: newSubscriber.id,
      dataSource: foundDataSource.name,
    };
  }

  private runUpdates(dataSource: string): (value: unknown) => void {
    return (value) => {
      this.log('Running update for:', dataSource, 'value:', value);
      const foundSubscriptions = this.subscriptions.filter(
        (sub) => sub.dataSource == dataSource
      );
      foundSubscriptions.forEach((sub) => sub.updateFunction(value));
    }
  }

  removeSubscriber(subscription: SubscriptionData): void {
    const index = this.subscriptions.findIndex((s) => s === subscription);

    if (index) {
    this.log('Removing subscriber', subscription.subscriber);

      this.subscriptions.splice(index, 1);
    }
    this.checkEmptyDataSources();
  }

  private checkEmptyDataSources() {
    this.log('Checking for empty data sources');

    this.dataSources.forEach((ds) => {
      if (!this.subscriptions.some((sub) => sub.dataSource === ds.name)) {
        this.log('Data source', ds.name, 'is empty, stopping it');
        ds.stop();
      }
    });
  }

  private validateDataSources(
    dataSources: DataSource<unknown>[]
  ): DataSource<unknown>[] {
    this.dataSources.reduce((map, dataSource) => {
      if (map.includes(dataSource.name)) {
        throw "Mupliple data sources with same name";
      }
      map.push(dataSource.name);
      return map;
    }, [] as string[]);

    return dataSources;
  }
}
