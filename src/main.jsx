import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CurrencyProvider } from "./context/CurrencyContext";

ReactDOM.render(
  <CurrencyProvider>
    <App />
  </CurrencyProvider>,
  document.getElementById("root")
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
