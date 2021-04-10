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

interface PersistedData<DATA_MODEL> {
  dataSourceValues: { [K in keyof DATA_MODEL]?: any };
}

export interface DataLoaderEvent {
  action: any;
  data: any;
}

interface DataSourceEvent<DATA_MODEL extends DataSourceModel>
  extends DataLoaderEvent {
  action: "subscribe" | "unsubsribe";
  data: {
    dataSource: keyof DATA_MODEL;
    subscriberId: number;
  };
}

interface DataLoaderInternalEvent<DATA_MODEL extends DataSourceModel>
  extends DataLoaderEvent {
  action: "initialize" | "uninitialize";
}

interface DataLoaderPersistEvent<DATA_MODEL extends DataSourceModel>
  extends DataLoaderEvent {
  action: "persist" | "rehydrate";
  data: any;
}

/**
 * Configuration object for data loader
 */
export interface DataLoaderConfig<DATA_MODEL extends DataSourceModel> {
  /** Whether to log the actions of this `DataLoader`, or not. Default: `true` */
  log?: boolean;
  /** Persist the data to browser */
  persist?: "localStorage" | "sessionStorage";
  /** Global data for data sources */
  data?: any;
  onEvent?: (e: DataLoaderEvent) => void;
}

export default class DataLoader<DATA_MODEL extends DataSourceModel> {
  private dataSources: DataSource<DATA_MODEL, any>[] = [];
  private dataSourceValues: { [K in keyof DATA_MODEL]?: any } = {};
  private subscriptions: ISubscription<any>[] = [];
  private nextId: number = 0;
  private freeIds: number[] = [];

  private config: DataLoaderConfig<DATA_MODEL> = {
    log: false,
  };

  //#region public

  constructor(
    dataSources: DataSourceConfig<DATA_MODEL>,
    config?: Partial<DataLoaderConfig<DATA_MODEL>>
  ) {
    try {
      this.dataSources = this.transformDataSources(dataSources);
      if (config) {
        this.config = {
          ...this.config,
          ...config,
        };
      }

      const peristedValue = this.rehydrate(this.config.persist);

      if (peristedValue !== null) {
        this.dataSourceValues = peristedValue.dataSourceValues;
      }
    } catch (error) {
      console.error("Failed creating DataLoader:", error);
    }

    // In other than production environments, provide the DataLoader-instances via window-object
    if (process.env.NODE_ENV !== "production") {
      (window as any).$ReactDataLoader = (window as any).$ReactDataLoader || {};
      (window as any).$ReactDataLoader[
        this.dataSources.map((ds) => ds.name).join("|")
      ] = this;
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
  ): number {
    const foundDataSource = this.dataSources.find(
      (ds) => ds.name === dataSource
    );

    if (foundDataSource === undefined) {
      throw `Data source ${dataSource.toString()} is not set up`;
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
      // If there is an existing value (from persitence), pass it to the subscriber
      if (this.dataSourceValues[foundDataSource.name]) {
        newSubscriber.updateFunction(
          this.dataSourceValues[foundDataSource.name]
        );
      }
      foundDataSource.start(this.runUpdates(dataSource), this.config.data);
    } else {
      // If the datasource is already running, we push it's last value to the new subscriber
      newSubscriber.updateFunction(this.dataSourceValues[foundDataSource.name]);
    }

    this.fireEvent<DataSourceEvent<DATA_MODEL>>({
      action: "subscribe",
      data: {
        dataSource,
        subscriberId: newSubscriber.id,
      },
    });

    return newSubscriber.id;
  }

  /**
   * Removes a subscriber
   * @param subscriberId The id of the subscriber to remove
   */
  removeSubscriber(subscriberId: number): void {
    this._removeSubscriber(subscriberId);
    this.checkEmptyDataSources();
  }

  /**
   * Removes all existing subscriptions from all data sources
   */
  removeAllSubscriptions(): void {
    this.log("Removing all subscribers");

    this.subscriptions.forEach((sub) => this._removeSubscriber(sub.id));
  }

  //#endregion

  //#region private

  private fireEvent<T extends DataLoaderEvent>(e: T) {
    if (this.config.onEvent !== undefined) {
      this.config.onEvent(e);
    }
  }

  private persist(
    persistenceType: DataLoaderConfig<DATA_MODEL>["persist"]
  ): void {
    if (!persistenceType) return;

    const dataToPersist: PersistedData<DATA_MODEL> = {
      dataSourceValues: this.dataSourceValues,
    };

    const json = JSON.stringify(dataToPersist);

    switch (persistenceType) {
      case "localStorage":
        localStorage.setItem("DataLoader-persist", json);
      case "sessionStorage":
        sessionStorage.setItem("DataLoader-persist", json);
    }

    this.fireEvent<DataLoaderPersistEvent<DATA_MODEL>>({
      action: 'persist',
      data: {
        [persistenceType]: dataToPersist,
      },
    });
  }

  private rehydrate(
    persistenceType: DataLoaderConfig<DATA_MODEL>["persist"]
  ): PersistedData<DATA_MODEL> | null {
    if (!persistenceType) return null;

    let json: string | null;

    switch (persistenceType) {
      case "localStorage":
        json = localStorage.getItem("DataLoader-persist");
      case "sessionStorage":
        json = sessionStorage.getItem("DataLoader-persist");
    }

    let data: PersistedData<DATA_MODEL> | null; 

    if (json == null) {
      data = null;
    } else {
      data = JSON.parse(json) as PersistedData<DATA_MODEL>;
    }

    this.fireEvent<DataLoaderPersistEvent<DATA_MODEL>>({
      action: 'rehydrate',
      data: {
        [persistenceType]: data,
      },
    });

    return data;
  }

  /**
   * Removes a subscriber
   * @param subscriberId The id of the subscriber to remove
   */
  private _removeSubscriber(subscriberId: number): void {
    this.log("Removing subscriber", subscriberId);

    const index = this.subscriptions.findIndex((s) => s.id === subscriberId);

    // Remove subscriber and put its id to freeIds-array so it can be used again
    if (index >= 0) {
      const [removedSubscriber] = this.subscriptions.splice(index, 1);
      this.freeIds.push(removedSubscriber.id);

      this.fireEvent<DataSourceEvent<DATA_MODEL>>({
        action: "unsubsribe",
        data: {
          dataSource: removedSubscriber.dataSource,
          subscriberId: removedSubscriber.id,
        },
      });
    }
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
      this.persist(this.config.persist);
    };
  }
  //#endregion
}
