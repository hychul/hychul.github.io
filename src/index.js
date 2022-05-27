import React from "react";
import ReactDOM from "react-dom/client";
import "main/resource/style/index.css";
import App from "main/javascript/App";
import reportWebVitals from "main/javascript/util/reportWebVitals";
import configureStore from "main/javascript/redux/store";
import { Provider } from "react-redux";

let store = configureStore();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
