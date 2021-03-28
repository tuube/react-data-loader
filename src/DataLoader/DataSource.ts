import { DataSourceModel } from "./index";

export interface IStopFunc {
  (): void;
}

export interface IAction<VALUE> {
  (update: IUpdate<VALUE>, globalData?: any): IStopFunc | void;
}

export interface IUpdate<VALUE> {
  (value: VALUE): void;
}

export default class DataSource<
  DATA_MODEL extends DataSourceModel,
  KEY extends keyof DATA_MODEL
> {
  name: KEY;
  action: IAction<DATA_MODEL[KEY]>;
  private stopFunc: IStopFunc | undefined = undefined;

  constructor(name: KEY, action: IAction<DATA_MODEL[KEY]>) {
    this.name = name;
    this.action = action;
  }

  /**
   * Start the datasource
   * @param update The function that is given to the action of the datasource.
   * It is used to get the new values from the datasource.
   * @param data Optional global data from the data loader
   */
  start(update: IUpdate<DATA_MODEL[KEY]>, data?: any): void {
    const _stopFunction = this.action(update, data);
    if (_stopFunction !== undefined) {
      this.stopFunc = _stopFunction;
    }
  }

  /**
   * Stop the datasource
   */
  stop(): void {
    if (this.stopFunc !== undefined) {
      this.stopFunc();
    }
  }
}
