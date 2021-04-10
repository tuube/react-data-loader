import React from "react";

import { useDataSource } from "./dataLoader";

const Todos = (): React.ReactElement => {
  const todos = useDataSource("todos");

  return (
    <div className="cards">
      {todos?.length &&
        todos.map((todo) => (
          <div className="card" key={todo.id}>
            <p>Title: {todo.title}</p>
            <p>User id: {todo.userId}</p>
            <p>Completed: {todo.completed}</p>
            <p>ID: {todo.id}</p>
          </div>
        ))}
    </div>
  );
};

export default Todos;
