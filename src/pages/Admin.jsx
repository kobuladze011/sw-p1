import { useState } from "react";
import styles from "./Admin.module.css";
import { useCoffeeAdmin } from "../hooks/useCoffeeAdmin";
import { useCurrency } from "../components/CurrencyContext";

export default function Admin() {
  const {
    ingredients,
    coffees,
    addIngredient,
    editIngredient,
    deleteIngredient,
    addCoffee,
    editCoffee,
    deleteCoffee,
  } = useCoffeeAdmin();
  const { currency, convertPrice } = useCurrency();

  const [newIngredient, setNewIngredient] = useState({
    name: "",
    price: "",
    description: "",
    isInStock: true,
  });
  const [editingIngredient, setEditingIngredient] = useState(null);

  const [newCoffee, setNewCoffee] = useState({
    title: "",
    ingredients: [],
    description: "",
    isInStock: true,
  });
  const [editingCoffee, setEditingCoffee] = useState(null);

  const [showIngredients, setShowIngredients] = useState(true);
  const [showCoffees, setShowCoffees] = useState(true);

  function toggleCoffeeIngredient(id) {
    setNewCoffee((prev) => ({
      ...prev,
      ingredients: prev.ingredients.includes(id)
        ? prev.ingredients.filter((i) => i !== id)
        : [...prev.ingredients, id],
    }));
  }

  function submitIngredient(e) {
    e.preventDefault();
    if (editingIngredient) {
      editIngredient({
        ...editingIngredient,
        ...newIngredient,
        price: Number(newIngredient.price),
      });
      setEditingIngredient(null);
    } else {
      addIngredient({ ...newIngredient, price: Number(newIngredient.price) });
    }
    setNewIngredient({ name: "", price: "", description: "", isInStock: true });
  }

  function submitCoffee(e) {
    e.preventDefault();
    if (editingCoffee) {
      editCoffee({ ...editingCoffee, ...newCoffee });
      setEditingCoffee(null);
    } else {
      addCoffee(newCoffee);
    }
    setNewCoffee({
      title: "",
      ingredients: [],
      description: "",
      isInStock: true,
    });
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Coffee Shop Admin Panel</h1>

      {/* Ingredients Section */}
      <div className={styles.section}>
        <h2>Ingredients</h2>

        <form onSubmit={submitIngredient} className={styles.form}>
          <input
            placeholder="Name"
            value={newIngredient.name}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, name: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newIngredient.price}
            onChange={(e) =>
              setNewIngredient({ ...newIngredient, price: e.target.value })
            }
            required
          />
          <input
            placeholder="Description"
            value={newIngredient.description}
            onChange={(e) =>
              setNewIngredient({
                ...newIngredient,
                description: e.target.value,
              })
            }
          />
          <label>
            <input
              type="checkbox"
              checked={newIngredient.isInStock}
              onChange={(e) =>
                setNewIngredient({
                  ...newIngredient,
                  isInStock: e.target.checked,
                })
              }
            />
            In Stock
          </label>
          <button type="submit" className={styles.button}>
            {editingIngredient ? "Save Ingredient" : "Add Ingredient"}
          </button>
        </form>

        <button
          className={styles.button}
          onClick={() => setShowIngredients((prev) => !prev)}
        >
          {showIngredients ? "Hide Ingredients List" : "Show Ingredients List"}
        </button>

        {showIngredients && (
          <ul className={styles.list}>
            {ingredients.map((i) => (
              <li key={i.id} className={styles.listItem}>
                <span>
                  <strong>{i.name}</strong> — {convertPrice(i.price)} {currency}{" "}
                  — {i.isInStock ? "Available" : "Out of stock"}
                </span>

                <div className={styles.buttonGroup}>
                  <button
                    className={styles.button}
                    onClick={() => {
                      setEditingIngredient(i);
                      setNewIngredient({ ...i });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.button}
                    onClick={() => deleteIngredient(i.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Coffees Section */}
      <div className={styles.section}>
        <h2>Coffees</h2>

        {/* Coffee Form */}
        <form onSubmit={submitCoffee} className={styles.form}>
          <input
            placeholder="Title"
            value={newCoffee.title}
            onChange={(e) =>
              setNewCoffee({ ...newCoffee, title: e.target.value })
            }
            required
          />
          <input
            placeholder="Description"
            value={newCoffee.description}
            onChange={(e) =>
              setNewCoffee({ ...newCoffee, description: e.target.value })
            }
          />

          <label>
            <input
              type="checkbox"
              checked={newCoffee.isInStock}
              onChange={(e) =>
                setNewCoffee({ ...newCoffee, isInStock: e.target.checked })
              }
            />
            In Stock
          </label>

          <div className={styles.ingredientsCheckbox}>
            <h4>Select Ingredients:</h4>
            {ingredients.map((i) => (
              <label key={i.id}>
                <input
                  type="checkbox"
                  checked={newCoffee.ingredients.includes(i.id)}
                  onChange={() => {
                    setNewCoffee((prev) => ({
                      ...prev,
                      ingredients: prev.ingredients.includes(i.id)
                        ? prev.ingredients.filter((id) => id !== i.id)
                        : [...prev.ingredients, i.id],
                    }));
                  }}
                />
                {i.name}
              </label>
            ))}
          </div>

          <p className={styles.priceDisplay}>
            Calculated Price:{" "}
            {convertPrice(
              2 +
                newCoffee.ingredients
                  .map((id) => ingredients.find((i) => i.id === id)?.price || 0)
                  .reduce((a, b) => a + b, 0)
            )}{" "}
            {currency}
          </p>

          <button type="submit" className={styles.button}>
            {editingCoffee ? "Save Coffee" : "Add Coffee"}
          </button>
        </form>

        {/* Toggle Coffee List */}
        <button
          className={styles.button}
          onClick={() => setShowCoffees((prev) => !prev)}
        >
          {showCoffees ? "Hide Coffees List" : "Show Coffees List"}
        </button>

        {/* Coffee List */}
        {showCoffees && (
          <ul className={styles.list}>
            {coffees.map((c) => (
              <li key={c.id} className={styles.listItem}>
                <div>
                  <strong>{c.title}</strong> —{" "}
                  {convertPrice(
                    2 +
                      c.ingredients
                        .map(
                          (id) =>
                            ingredients.find((i) => i.id === id)?.price || 0
                        )
                        .reduce((a, b) => a + b, 0)
                  )}{" "}
                  {currency} — {c.isInStock ? "Available" : "Out of stock"}
                  <div
                    style={{
                      fontSize: "0.9rem",
                      marginTop: "4px",
                      color: "#5c4033",
                    }}
                  >
                    Ingredients:{" "}
                    {c.ingredients
                      .map((id) => ingredients.find((i) => i.id === id)?.name)
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    className={styles.button}
                    onClick={() => {
                      setEditingCoffee(c);
                      setNewCoffee({
                        title: c.title,
                        description: c.description,
                        ingredients: [...c.ingredients],
                        isInStock: c.isInStock,
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className={styles.button}
                    onClick={() => deleteCoffee(c.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
