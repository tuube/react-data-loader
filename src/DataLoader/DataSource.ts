
interface IStopFunc {
  (): void;
}

interface IAction<T> {
  (update: (value: T) => void): IStopFunc; 
}

export interface IUpdate<T> {
  (value: T): void;
}

export default class DataSource<T> {
  name: string;
  action:  IAction<T>;
  private stopFunc: IStopFunc | undefined = undefined;

  constructor(name: string, action: IAction<T>) {
    this.name = name;
    this.action = action;
  }

  start(update: IUpdate<T>): void {
    this.stopFunc = this.action(update);
  }

  stop(): void {
    if (this.stopFunc !== undefined) {
      this.stopFunc();
    }
  }
}


