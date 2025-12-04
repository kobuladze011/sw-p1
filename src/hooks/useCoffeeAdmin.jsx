import { useState, useEffect } from "react";

export function useCoffeeAdmin() {
  const [ingredients, setIngredients] = useState([]);
  const [coffees, setCoffees] = useState([]);

  // Fetch ingredients & coffees
  useEffect(() => {
    fetch("http://localhost:3000/ingredients")
      .then((res) => res.json())
      .then(setIngredients);

    fetch("http://localhost:3000/coffees")
      .then((res) => res.json())
      .then(setCoffees);
  }, []);

  // Add Ingredient
  function addIngredient(ingredient) {
    const newIngredient = { ...ingredient, id: Date.now(), isInStock: true };
    fetch("http://localhost:3000/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIngredient),
    })
      .then((res) => res.json())
      .then((data) => setIngredients((prev) => [...prev, data]));
  }

  // Edit Ingredient
  function editIngredient(updatedIngredient) {
    fetch(`http://localhost:3000/ingredients/${updatedIngredient.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedIngredient),
    }).then(() => {
      // Update local ingredient state
      setIngredients((prev) =>
        prev.map((i) => (i.id === updatedIngredient.id ? updatedIngredient : i))
      );

      // Find coffees that use this ingredient
      const affectedCoffees = coffees.filter((c) =>
        c.ingredients.includes(updatedIngredient.id)
      );

      affectedCoffees.forEach((coffee) => {
        // Recalculate coffeePrice based on updated ingredients
        const newPrice =
          2 +
          coffee.ingredients
            .map((id) => {
              const ing =
                id === updatedIngredient.id
                  ? updatedIngredient
                  : ingredients.find((i) => i.id === id);
              return ing?.price || 0;
            })
            .reduce((a, b) => a + b, 0);

        // Update coffee in the DB
        fetch(`http://localhost:3000/coffees/${coffee.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coffeePrice: newPrice }),
        });

        // Update local coffee state
        setCoffees((prev) =>
          prev.map((c) =>
            c.id === coffee.id ? { ...c, coffeePrice: newPrice } : c
          )
        );
      });
    });
  }

  // Delete Ingredient
  function deleteIngredient(id) {
    // Delete ingredient from server
    fetch(`http://localhost:3000/ingredients/${id}`, { method: "DELETE" }).then(
      () => {
        // Update local ingredients state
        setIngredients((prev) => prev.filter((i) => i.id !== id));

        // Update coffees: remove the deleted ingredient from each coffee
        setCoffees((prev) =>
          prev.map((c) => {
            const newIngredients = c.ingredients.filter(
              (ingId) => ingId !== id
            );
            const isInStock = newIngredients.every(
              (ingId) => ingredients.find((i) => i.id === ingId)?.isInStock
            );
            return { ...c, ingredients: newIngredients, isInStock };
          })
        );

        // Optional: update coffees on server
        coffees.forEach((coffee) => {
          const updatedIngredients = coffee.ingredients.filter(
            (ingId) => ingId !== id
          );
          const anyUnavailable = updatedIngredients.some(
            (ingId) => !ingredients.find((i) => i.id === ingId)?.isInStock
          );
          fetch(`http://localhost:3000/coffees/${coffee.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ingredients: updatedIngredients,
              isInStock: !anyUnavailable,
            }),
          });
        });
      }
    );
  }

  // Add Coffee
  function addCoffee(coffee) {
    const coffeePrice =
      2 +
      coffee.ingredients
        .map(
          (id) =>
            ingredients.find((i) => Number(i.id) === Number(id))?.price || 0
        )
        .reduce((a, b) => a + b, 0);

    const anyIngredientUnavailable = coffee.ingredients.some(
      (id) => !ingredients.find((i) => Number(i.id) === Number(id))?.isInStock
    );

    const newCoffee = {
      ...coffee,
      id: Date.now(),
      coffeePrice,
      isInStock: !anyIngredientUnavailable,
    };

    fetch("http://localhost:3000/coffees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCoffee),
    })
      .then((res) => res.json())
      .then((data) => setCoffees((prev) => [...prev, data]));
  }

  // Edit Coffee
  function editCoffee(updatedCoffee) {
    const coffeePrice =
      2 +
      updatedCoffee.ingredients
        .map(
          (id) =>
            ingredients.find((i) => Number(i.id) === Number(id))?.price || 0
        )
        .reduce((a, b) => a + b, 0);

    const anyIngredientUnavailable = updatedCoffee.ingredients.some(
      (id) => !ingredients.find((i) => Number(i.id) === Number(id))?.isInStock
    );

    const coffeeToSave = {
      ...updatedCoffee,
      coffeePrice,
      isInStock: !anyIngredientUnavailable,
    };

    fetch(`http://localhost:3000/coffees/${updatedCoffee.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coffeeToSave),
    }).then(() => {
      setCoffees((prev) =>
        prev.map((c) => (c.id === updatedCoffee.id ? coffeeToSave : c))
      );
    });
  }

  // Delete Coffee
  function deleteCoffee(id) {
    fetch(`http://localhost:3000/coffees/${id}`, { method: "DELETE" }).then(
      () => setCoffees((prev) => prev.filter((c) => c.id !== id))
    );
  }

  // Return everything
  return {
    ingredients,
    coffees,
    addIngredient,
    editIngredient,
    deleteIngredient,
    addCoffee,
    editCoffee,
    deleteCoffee,
  };
}
