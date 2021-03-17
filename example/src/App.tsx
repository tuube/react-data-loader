import React, { useState } from "react";
import "./App.css";
import Test from "./Test";

function App() {
  const [tests, setTests] = useState<string[]>([]);

  const addTest = () => {
    setTests((tests) => [...tests, `Test${tests.length + 1}`]);
  };

  const removeTest = () => {
    setTests((tests) => [...tests.slice(0, tests.length - 1)]);
  };

  return (
    <div className="App">
      <button onClick={addTest}>Add test</button>
      <button onClick={removeTest}>Remove test</button>
      <div style={{ margin: "2rem" }}>
        {tests.map((name) => (
          <Test name={name} key={name} />
        ))}
      </div>
    </div>
  );
}

export default App;
