import { useState, useEffect } from "react";

const API_URL = "http://localhost:3000";

export function useCoffeeAdmin() {
  const [ingredients, setIngredients] = useState([]);
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch ingredients & coffees
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API_URL}/ingredients`).then((res) => res.json()),
      fetch(`${API_URL}/coffees`).then((res) => res.json()),
    ])
      .then(([ingredientsData, coffeesData]) => {
        setIngredients(ingredientsData);
        setCoffees(coffeesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  // Add Ingredient
  function addIngredient(ingredient) {
    const newIngredient = {
      ...ingredient,
      id: String(Date.now()),
      price: Number(ingredient.price),
      isInStock: ingredient.isInStock ?? true,
    };

    fetch(`${API_URL}/ingredients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIngredient),
    })
      .then((res) => res.json())
      .then((data) => setIngredients((prev) => [...prev, data]))
      .catch((err) => console.error("Error adding ingredient:", err));
  }

  // Edit Ingredient
  function editIngredient(updatedIngredient) {
    const ingredientToSave = {
      ...updatedIngredient,
      price: Number(updatedIngredient.price),
    };

    fetch(`${API_URL}/ingredients/${updatedIngredient.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ingredientToSave),
    })
      .then((res) => res.json())
      .then((data) => {
        setIngredients((prev) =>
          prev.map((i) => (i.id === data.id ? data : i))
        );

        // Update coffees that use this ingredient
        coffees.forEach((coffee) => {
          if (coffee.ingredients.includes(String(updatedIngredient.id))) {
            // Recalculate price
            const newPrice = calculateCoffeePrice(coffee.ingredients, [
              ...ingredients.filter((i) => i.id !== updatedIngredient.id),
              ingredientToSave,
            ]);

            fetch(`${API_URL}/coffees/${coffee.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ coffeePrice: newPrice }),
            });

            setCoffees((prev) =>
              prev.map((c) =>
                c.id === coffee.id ? { ...c, coffeePrice: newPrice } : c
              )
            );
          }
        });
      })
      .catch((err) => console.error("Error editing ingredient:", err));
  }

  // Delete Ingredient
  function deleteIngredient(id) {
    fetch(`${API_URL}/ingredients/${id}`, { method: "DELETE" })
      .then(() => {
        setIngredients((prev) => prev.filter((i) => i.id !== id));

        // Remove ingredient from coffees and update prices
        coffees.forEach((coffee) => {
          if (coffee.ingredients.includes(String(id))) {
            const newIngredients = coffee.ingredients.filter(
              (ingId) => ingId !== String(id)
            );
            const newPrice = calculateCoffeePrice(
              newIngredients,
              ingredients.filter((i) => i.id !== id)
            );

            fetch(`${API_URL}/coffees/${coffee.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ingredients: newIngredients,
                coffeePrice: newPrice,
              }),
            });
          }
        });

        setCoffees((prev) =>
          prev.map((c) => ({
            ...c,
            ingredients: c.ingredients.filter((ingId) => ingId !== String(id)),
          }))
        );
      })
      .catch((err) => console.error("Error deleting ingredient:", err));
  }

  // Calculate coffee price helper
  function calculateCoffeePrice(ingredientIds, ingredientsList) {
    const BASE_PRICE = 4;
    const ingredientsTotal = ingredientIds.reduce((sum, id) => {
      const ingredient = ingredientsList.find((i) => String(i.id) === String(id));
      return sum + (ingredient?.price || 0);
    }, 0);
    return BASE_PRICE + ingredientsTotal;
  }

  // Add Coffee
  function addCoffee(coffee) {
    const anyIngredientUnavailable = coffee.ingredients.some((id) => {
      const ingredient = ingredients.find((i) => String(i.id) === String(id));
      return ingredient && !ingredient.isInStock;
    });

    const newCoffee = {
      ...coffee,
      id: String(Date.now()),
      coffeePrice: Number(coffee.coffeePrice) || 0,
      isInStock: coffee.isInStock && !anyIngredientUnavailable,
    };

    fetch(`${API_URL}/coffees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCoffee),
    })
      .then((res) => res.json())
      .then((data) => setCoffees((prev) => [...prev, data]))
      .catch((err) => console.error("Error adding coffee:", err));
  }

  // Edit Coffee
  function editCoffee(updatedCoffee) {
    const anyIngredientUnavailable = updatedCoffee.ingredients.some((id) => {
      const ingredient = ingredients.find((i) => String(i.id) === String(id));
      return ingredient && !ingredient.isInStock;
    });

    const coffeeToSave = {
      ...updatedCoffee,
      coffeePrice: Number(updatedCoffee.coffeePrice) || 0,
      isInStock: updatedCoffee.isInStock && !anyIngredientUnavailable,
    };

    fetch(`${API_URL}/coffees/${updatedCoffee.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coffeeToSave),
    })
      .then((res) => res.json())
      .then((data) => {
        setCoffees((prev) =>
          prev.map((c) => (c.id === data.id ? data : c))
        );
      })
      .catch((err) => console.error("Error editing coffee:", err));
  }

  // Delete Coffee
  function deleteCoffee(id) {
    fetch(`${API_URL}/coffees/${id}`, { method: "DELETE" })
      .then(() => {
        setCoffees((prev) => prev.filter((c) => c.id !== id));
      })
      .catch((err) => console.error("Error deleting coffee:", err));
  }

  return {
    ingredients,
    coffees,
    loading,
    addIngredient,
    editIngredient,
    deleteIngredient,
    addCoffee,
    editCoffee,
    deleteCoffee,
  };
}
