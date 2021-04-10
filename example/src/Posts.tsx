import React from "react";

import { useDataSource } from "./dataLoader";


const Posts = (): React.ReactElement => {
  const todos = useDataSource("posts");

  return (
    <div className="cards">
      {todos?.length &&
        todos.map((todo) => (
          <div className="card" key={todo.id}>
            <p>Title: {todo.title}</p>
            <p>User id: {todo.userId}</p>
            <p>Body: {todo.body}</p>
            <p>ID: {todo.id}</p>
          </div>
        ))}
    </div>
  );
};

export default Posts;
