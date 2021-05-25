import {
  DataSourceConfig,
  createDataLoaderProviderAndHook,
} from "react-data-loader";

export type AppDataSources = {
  todos: Todo[];
  posts: Post[];
};

export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const dataSources: DataSourceConfig<AppDataSources> = {
  todos: (update, data) => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((json: Todo[]) => update(json));
  },
  posts: (update) => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json: Post[]) => update(json));
  }
};

const { hook, provider } = createDataLoaderProviderAndHook(dataSources, {
  data: { id: 2 },
  persist: "localStorage",
  onEvent: (e) => {
    console.log(e);
  }
});
export default provider;

export const useDataSource = hook;
