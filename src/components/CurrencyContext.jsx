import React, { createContext, useContext, useState, useEffect } from "react";

export const CurrencyContext = createContext();

const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;

export function CurrencyProvider({ children }) {
  // Load currency from localStorage or default to GEL
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("currency") || "GEL";
  });

  const [rate, setRate] = useState(0);

  useEffect(() => {
    fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/GEL`)
      .then((res) => res.json())
      .then((data) => setRate(data.conversion_rates["USD"]))
      .catch((err) => console.error(err));
  }, []);

  // Persist currency to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const toggleCurrency = () =>
    setCurrency((prev) => (prev === "GEL" ? "USD" : "GEL"));

  const convertPrice = (price) =>
    currency === "GEL"
      ? price.toFixed(2) + " ₾"
      : (price * rate).toFixed(2) + " $";

  return (
    <CurrencyContext.Provider
      value={{ currency, toggleCurrency, convertPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
