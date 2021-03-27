import DataSource, { IUpdate, IAction } from "./DataSource";

interface ISubscription<T> {
  id: number;
  dataSource: string;
  updateFunction: IUpdate<T>;
}

export type DataSourceConfig<DATA_MODEL extends DataSourceModel> = {
  [K in keyof DATA_MODEL]: IAction<DATA_MODEL[K]>;
};

export type DataSourceModel = {
  [k in DataSourceNameType]: any;
};

type DataSourceNameType = string | number | symbol;

export interface DataLoaderConfig {
  /** Whether to log the actions of this `DataLoader`, or not. Default: `true` */
  log: boolean;
}

export default class DataLoader<DATA_MODEL extends DataSourceModel> {
  private dataSources: DataSource<DATA_MODEL, any>[] = [];
  private dataSourceValues: { [K in keyof DATA_MODEL]?: any } = {};
  private subscriptions: ISubscription<any>[] = [];
  private nextId: number = 0;
  private freeIds: number[] = [];

  private config: DataLoaderConfig = {
    log: false,
  };

  //#region public

  constructor(
    dataSources: DataSourceConfig<DATA_MODEL>,
    config?: Partial<DataLoaderConfig>
  ) {
    try {
      this.dataSources = this.transformDataSources(dataSources);
      if (config) {
        this.config = {
          ...this.config,
          ...config,
        };
      }
    } catch (error) {
      console.error("Failed creating DataLoader:", error);
    }

    // In other than production environments, provide the DataLoader-instances via window-object
    if (process.env.NODE_ENV !== "production") {
      (window as any).$ReactDataLoader = (window as any).$ReactDataLoader || [];
      (window as any).$ReactDataLoader.push(this);
    }
  }

  /**
   * Add a new subscriber to the specified `dataSource`
   * @param dataSource The wanted `dataSource`
   * @param updateFunction The function that gets the new values
   * @returns The id of the new subscription
   */
  addSubscriber<DATA_SOURCE extends keyof DATA_MODEL>(
    dataSource: DATA_SOURCE,
    updateFunction: IUpdate<DataSourceModel[DATA_SOURCE]>
  ): number | undefined {
    const foundDataSource = this.dataSources.find(
      (ds) => ds.name === dataSource
    );

    if (foundDataSource === undefined) {
      throw `Data source ${dataSource.toString()} is not set up, skipping`;
    }

    const newSubscriber: ISubscription<any> = {
      id: this.getSubscriptionId(),
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

    return newSubscriber.id;
  }

  /**
   * Removes a subscriber
   * @param subscriberId The id of the subscriber to remove
   */
  removeSubscriber(subscriberId: number): void {
    this.log("Removing subscriber", subscriberId);

    const index = this.subscriptions.findIndex((s) => s.id === subscriberId);

    // Remove subscriber and put its id to freeIds-array so it can be used again
    if (index >= 0) {
      const removedSubscriber = this.subscriptions.splice(index, 1);
      this.freeIds.push(removedSubscriber[0].id);
    }

    this.checkEmptyDataSources();
  }

  /**
   * Look for empty dataSources and if found, stop them
   */
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

  /**
   * Get a valid id for a new subscription.
   * The id is gotten from freeIds-array if it has any, or a new id is created.
   */
  private getSubscriptionId(): number {
    if (this.freeIds.length > 0) {
      return this.freeIds.shift() as number;
    }
    return this.nextId++;
  }

  /**
   * Transforms figen dataSource configuration to the correcr format
   * @param dataSources The dataSource config
   */
  private transformDataSources(
    dataSources: DataSourceConfig<DATA_MODEL>
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

  /**
   * Logs the given data if logging is active
   * @param args The stuff to log
   */
  private log(...args: unknown[]): void {
    if (this.config.log) {
      console.log("DataLoader:", ...args);
    }
  }

  /**
   * Push updated values to the `dataSource`'s subscribers
   * @param dataSource The dataSource
   */
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
