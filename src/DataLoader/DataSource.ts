import { DataSourceModel } from "./index";

export interface IStopFunc {
  (): void;
}

export interface IAction<VALUE> {
  (update: (value: VALUE) => void): IStopFunc;
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

  start(update: IUpdate<DATA_MODEL[KEY]>): void {
    this.stopFunc = this.action(update);
  }

  stop(): void {
    if (this.stopFunc !== undefined) {
      this.stopFunc();
    }
  }
}
