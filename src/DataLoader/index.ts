import DataSource, { IUpdate } from "./DataSource";

interface ISubscription {
  dataSource: string;
  updateFunction: IUpdate<unknown>;
}

export default class DataLoader {
  private dataSources: DataSource<unknown>[] = [];
  private subscriptions: ISubscription[] = [];

  //#region public

  constructor(dataSources: DataSource<unknown>[]) {
    try {
      this.dataSources = this.validateDataSources(dataSources);
    } catch (error) {
      console.error("Failed creating DataLoader:", error);
    }
  }

  addSubscriber(
    dataSource: string,
    updateFunction: IUpdate<unknown>
  ): number | undefined {
    const foundDataSource = this.dataSources.find(
      (ds) => ds.name === dataSource
    );

    if (foundDataSource === undefined) {
      console.warn(`Data source ${dataSource} is not set up, skipping`);
      return;
    }

    this.subscriptions.push({
      dataSource: foundDataSource.name,
      updateFunction,
    });

    const newSubscriber = this.subscriptions.length - 1;

    this.log("Adding subscriber", newSubscriber);

    if (
      this.subscriptions.filter((sub) => sub.dataSource === dataSource)
        .length === 1
    ) {
      foundDataSource.start(this.runUpdates(dataSource));
    }

    return newSubscriber;
  }

  removeSubscriber(subscriber: number): void {
    this.log("Removing subscriber", subscriber);

    this.subscriptions.splice(subscriber, 1);

    this.checkEmptyDataSources();
  }

  private checkEmptyDataSources() {
    this.log("Checking for empty data sources");

    this.dataSources.forEach((ds) => {
      if (!this.subscriptions.some((sub) => sub.dataSource === ds.name)) {
        this.log("Data source", ds.name, "is empty, stopping it");
        ds.stop();
      }
    });
  }
  //#endregion

  //#region private

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
  private log(...args: unknown[]): void {
    console.log("DataLoader:", ...args);
  }

  private runUpdates(dataSource: string): (value: unknown) => void {
    return (value) => {
      this.log("Running update for:", dataSource, "value:", value);
      const foundSubscriptions = this.subscriptions.filter(
        (sub) => sub.dataSource == dataSource
      );
      foundSubscriptions.forEach((sub) => sub.updateFunction(value));
    };
  }
  //#endregion
}
