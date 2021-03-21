import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import dataSources from "./dataLoader";
import { DataLoaderProvider } from "react-data-loader";

ReactDOM.render(
  <React.StrictMode>
    <DataLoaderProvider dataSources={dataSources}>
      <App />
    </DataLoaderProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
