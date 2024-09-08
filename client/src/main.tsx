import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import "./index.css";
import { StatusProvider } from "./contexts/Status.tsx";
import { UserProvider } from "./contexts/user.tsx";
import { CartProvider } from "./contexts/Card.tsx";

axios.defaults.baseURL = "http://localhost:3000";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StatusProvider>
        <UserProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </UserProvider>
      </StatusProvider>
    </BrowserRouter>
  </React.StrictMode>
);
