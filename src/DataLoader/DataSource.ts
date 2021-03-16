
interface IStopFunc {
  (): void;
}

interface IStartFunc {
  (): () => IStopFunc;
}

export default class DataSource {
  name: string;
  action: IStartFunc;
  private stopFunc: IStopFunc | undefined = undefined;

  constructor(name: string, action: IStartFunc) {
    this.name = name;
    this.action = action;
  }

  start() {
    this.stopFunc = this.action();
  }

  stop() {
    if (this.stopFunc !== undefined) {
      this.stopFunc();
    }
  }
}
