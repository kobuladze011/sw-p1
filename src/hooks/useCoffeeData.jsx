// src/hooks/useCoffeeData.jsx
import { useState, useEffect } from "react";

export function useCoffeeData() {
  const [ingredients, setIngredients] = useState([]);
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const fetchIngredients = fetch("http://localhost:3000/ingredients").then(
      (res) => res.json()
    );
    const fetchCoffees = fetch("http://localhost:3000/coffees").then((res) =>
      res.json()
    );

    Promise.all([fetchIngredients, fetchCoffees])
      .then(([ingredientsData, coffeesData]) => {
        setIngredients(ingredientsData);
        setCoffees(coffeesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { ingredients, coffees, loading, error };
}
