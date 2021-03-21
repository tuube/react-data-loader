import DataSource, { IUpdate, IAction } from "./DataSource";

interface ISubscription<T> {
  dataSource: string;
  updateFunction: IUpdate<T>;
}

type InternalDataSourceConfig<DATA_MODEL extends DataSourceModel> = {
  [K in keyof DATA_MODEL]: IAction<DATA_MODEL[K]>;
};

export type DataSourceModel = {
  [k in DataSourceNameType]: any;
};

export type DataSourceConfig<T extends DataSourceModel> = {
  [k in keyof T]: (update: (value: T[k]) => void) => () => void;
};

type DataSourceNameType = string | number | symbol;

export default class DataLoader<DATA_MODEL extends DataSourceModel> {
  public dataSourceConfig: InternalDataSourceConfig<DATA_MODEL>;
  private dataSources: DataSource<DATA_MODEL, any>[] = [];
  private dataSourceValues: { [K in keyof DATA_MODEL]?: any } = {};
  private subscriptions: ISubscription<any>[] = [];

  //#region public

  constructor(dataSources: DataSourceConfig<DATA_MODEL>) {
    this.dataSourceConfig = dataSources;
    try {
      this.dataSources = this.transformDataSources(dataSources);
    } catch (error) {
      console.error("Failed creating DataLoader:", error);
    }

    if (process.env.NODE_ENV !== "production") {
      (window as any).$ReactDataLoader = this;
    }
  }

  addSubscriber<DATA_SOURCE extends keyof DATA_MODEL>(
    dataSource: DATA_SOURCE,
    updateFunction: IUpdate<DataSourceModel[DATA_SOURCE]>
  ): number | undefined {
    const foundDataSource = this.dataSources.find(
      (ds) => ds.name === dataSource
    );

    if (foundDataSource === undefined) {
      console.warn(
        `Data source ${dataSource.toString()} is not set up, skipping`
      );
      return;
    }

    const newSubscriber: ISubscription<any> = {
      dataSource: foundDataSource.name,
      updateFunction,
    };

    this.subscriptions.push(newSubscriber);

    this.log("Adding subscriber", newSubscriber);

    if (
      // If there are no subscriptions for the given datasource, we start it
      this.subscriptions.filter((sub) => sub.dataSource === dataSource)
        .length === 1
    ) {
      foundDataSource.start(this.runUpdates(dataSource));
    } else {
      // If the datasource is already running, we push it's last value to the new subscriber
      newSubscriber.updateFunction(this.dataSourceValues[foundDataSource.name]);
    }

    return this.subscriptions.length - 1;
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

  private transformDataSources(
    dataSources: InternalDataSourceConfig<DATA_MODEL>
  ): DataSource<DATA_MODEL, DATA_MODEL[keyof DATA_MODEL]>[] {
    const internalDataSources: DataSource<DATA_MODEL, any>[] = [];
    for (const source in dataSources) {
      if (Object.prototype.hasOwnProperty.call(dataSources, source)) {
        const action = dataSources[source];
        internalDataSources.push(
          new DataSource<DATA_MODEL, any>(source, action)
        );
      }
    }
    return internalDataSources;
  }

  private log(...args: unknown[]): void {
    console.log("DataLoader:", ...args);
  }

  private runUpdates(dataSource: keyof DATA_MODEL): (value: unknown) => void {
    return (value) => {
      this.log("Running update for:", dataSource, "value:", value);
      const foundSubscriptions = this.subscriptions.filter(
        (sub) => sub.dataSource === dataSource
      );
      foundSubscriptions.forEach((sub) => {
        sub.updateFunction(value);
        this.dataSourceValues[dataSource] = value;
      });
    };
  }
  //#endregion
}
