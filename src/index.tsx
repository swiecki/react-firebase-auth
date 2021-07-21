import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AuthProvider } from "./provider/AuthProvider";
import { AuthWrap } from "./AuthWrap";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <AuthWrap>
      <App/>
      </AuthWrap >
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);