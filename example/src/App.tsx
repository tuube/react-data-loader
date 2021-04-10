import React, { useState } from "react";
import "./App.css";
import Posts from "./Posts";
import Todos from "./Todos";

function App() {
  const [showTodos, setShowTodos] = useState(true);
  const [showPosts, setShowPosts] = useState(true);


  return (
      <div className="App">
        <div className="row">
          <div className="col">
            <button onClick={() => setShowTodos(!showTodos)}>Show todos</button>
            <button onClick={() => setShowPosts(!showPosts)}>Show posts</button>
          </div>
        </div>
        <div className="row">
          <div className="col">{showTodos && <Todos />}</div>
          <div className="col">{showPosts && <Posts />}</div>
        </div>
      </div>
  );
}

export default App;
