import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCoffeeAdmin } from "../hooks/useCoffeeAdmin";
import { useCurrency } from "../components/CurrencyContext";

export default function Admin() {
  const {
    ingredients,
    coffees,
    loading,
    addIngredient,
    editIngredient,
    deleteIngredient,
    addCoffee,
    editCoffee,
    deleteCoffee,
  } = useCoffeeAdmin();
  const { currency, toggleCurrency, convertPrice } = useCurrency();

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
    coffeePrice: "",
  });
  const [editingCoffee, setEditingCoffee] = useState(null);

  const [activeTab, setActiveTab] = useState("coffees");

  // Calculate suggested price based on selected ingredients
  const BASE_PRICE = 4;
  const suggestedPrice = BASE_PRICE + newCoffee.ingredients.reduce((sum, id) => {
    const ingredient = ingredients.find((i) => String(i.id) === String(id));
    return sum + (ingredient?.price || 0);
  }, 0);

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
    const coffeeData = {
      ...newCoffee,
      coffeePrice: Number(newCoffee.coffeePrice),
    };
    if (editingCoffee) {
      editCoffee({
        ...editingCoffee,
        ...coffeeData,
      });
      setEditingCoffee(null);
    } else {
      addCoffee(coffeeData);
    }
    setNewCoffee({
      title: "",
      ingredients: [],
      description: "",
      isInStock: true,
      coffeePrice: "",
    });
  }

  function cancelEdit() {
    setEditingIngredient(null);
    setEditingCoffee(null);
    setNewIngredient({ name: "", price: "", description: "", isInStock: true });
    setNewCoffee({ title: "", ingredients: [], description: "", isInStock: true, coffeePrice: "" });
  }

  function toggleIngredientSelection(ingredientId) {
    const id = String(ingredientId);
    setNewCoffee((prev) => ({
      ...prev,
      ingredients: prev.ingredients.includes(id)
        ? prev.ingredients.filter((i) => i !== id)
        : [...prev.ingredients, id],
    }));
  }

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Loading admin panel...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      {/* Hero Section with Header */}
      <Hero>
        <Header>
          <Logo>
            <CoffeeIconImg>☕</CoffeeIconImg>
            <LogoText>Coffee Shop</LogoText>
          </Logo>
          <NavButtons>
            <BackButton to="/">← Back to Site</BackButton>
            <CurrencyButton onClick={toggleCurrency}>{currency}</CurrencyButton>
          </NavButtons>
        </Header>
        <HeroContent>
          <HeroTitle>Admin Panel</HeroTitle>
          <HeroSubtitle>Manage your coffees and ingredients</HeroSubtitle>
        </HeroContent>
      </Hero>

      {/* Main Content */}
      <MainContent>
        {/* Tabs */}
        <TabsContainer>
          <Tab $active={activeTab === "coffees"} onClick={() => setActiveTab("coffees")}>
            ☕ Manage Coffees
          </Tab>
          <Tab $active={activeTab === "ingredients"} onClick={() => setActiveTab("ingredients")}>
            🧪 Manage Ingredients
          </Tab>
        </TabsContainer>

        {/* Coffees Section */}
        {activeTab === "coffees" && (
          <Section>
            <SectionTitle>
              {editingCoffee ? "✏️ Edit Coffee" : "➕ Add New Coffee"}
            </SectionTitle>

            <Form onSubmit={submitCoffee}>
              <FormRow>
                <FormGroup>
                  <Label>Coffee Name *</Label>
                  <Input
                    placeholder="e.g. Cappuccino"
                    value={newCoffee.title}
                    onChange={(e) => setNewCoffee({ ...newCoffee, title: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Price *</Label>
                  <PriceInputRow>
                    <Input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="e.g. 8"
                      value={newCoffee.coffeePrice}
                      onChange={(e) => setNewCoffee({ ...newCoffee, coffeePrice: e.target.value })}
                      required
                    />
                    <SuggestButton 
                      type="button" 
                      onClick={() => setNewCoffee({ ...newCoffee, coffeePrice: suggestedPrice })}
                    >
                      Use {convertPrice(suggestedPrice)}
                    </SuggestButton>
                  </PriceInputRow>
                  <PriceHint>Suggested: Base ({convertPrice(BASE_PRICE)}) + Ingredients = {convertPrice(suggestedPrice)}</PriceHint>
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>Description</Label>
                <Input
                  placeholder="Short description..."
                  value={newCoffee.description}
                  onChange={(e) => setNewCoffee({ ...newCoffee, description: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <Label>Select Ingredients</Label>
                <IngredientsGrid>
                  {ingredients.map((ingredient) => (
                    <IngredientCheckbox
                      key={ingredient.id}
                      $selected={newCoffee.ingredients.includes(String(ingredient.id))}
                      onClick={() => toggleIngredientSelection(ingredient.id)}
                    >
                      <CheckboxIcon $selected={newCoffee.ingredients.includes(String(ingredient.id))}>
                        {newCoffee.ingredients.includes(String(ingredient.id)) ? "✓" : ""}
                      </CheckboxIcon>
                      <span>{getIngredientIcon(ingredient.name)} {ingredient.name}</span>
                      <IngredientPriceTag>+{convertPrice(ingredient.price)}</IngredientPriceTag>
                    </IngredientCheckbox>
                  ))}
                </IngredientsGrid>
              </FormGroup>

              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={newCoffee.isInStock}
                  onChange={(e) => setNewCoffee({ ...newCoffee, isInStock: e.target.checked })}
                />
                <span>In Stock</span>
              </CheckboxLabel>

              <ButtonRow>
                <SubmitButton type="submit">
                  {editingCoffee ? "💾 Save Changes" : "➕ Add Coffee"}
                </SubmitButton>
                {editingCoffee && (
                  <CancelButton type="button" onClick={cancelEdit}>
                    ✕ Cancel
                  </CancelButton>
                )}
              </ButtonRow>
            </Form>

            <Divider />

            <ListTitle>☕ All Coffees ({coffees.length})</ListTitle>
            <ItemList>
              {coffees.length === 0 ? (
                <EmptyState>No coffees yet. Add your first coffee above!</EmptyState>
              ) : (
                coffees.map((c) => (
                  <ItemCard key={c.id}>
                    <ItemInfo>
                      <ItemName>{c.title}</ItemName>
                      <ItemDetails>
                        <ItemPrice>{convertPrice(c.coffeePrice)}</ItemPrice>
                        <StockBadge $inStock={c.isInStock}>
                          {c.isInStock ? "In Stock" : "Out of Stock"}
                        </StockBadge>
                      </ItemDetails>
                      <ItemDescription>{c.description}</ItemDescription>
                      <ItemIngredients>
                        {c.ingredients.length > 0
                          ? c.ingredients
                              .map((id) => {
                                const ing = ingredients.find((i) => String(i.id) === String(id));
                                return ing ? `${getIngredientIcon(ing.name)} ${ing.name}` : null;
                              })
                              .filter(Boolean)
                              .join(" • ")
                          : "No ingredients"}
                      </ItemIngredients>
                    </ItemInfo>
                    <ItemActions>
                      <EditButton
                        onClick={() => {
                          setEditingCoffee(c);
                          setNewCoffee({
                            title: c.title,
                            description: c.description || "",
                            ingredients: c.ingredients.map(String),
                            isInStock: c.isInStock,
                            coffeePrice: c.coffeePrice,
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        ✏️ Edit
                      </EditButton>
                      <DeleteButton onClick={() => {
                        if (window.confirm(`Delete "${c.title}"?`)) {
                          deleteCoffee(c.id);
                        }
                      }}>
                        🗑️ Delete
                      </DeleteButton>
                    </ItemActions>
                  </ItemCard>
                ))
              )}
            </ItemList>
          </Section>
        )}

        {/* Ingredients Section */}
        {activeTab === "ingredients" && (
          <Section>
            <SectionTitle>
              {editingIngredient ? "✏️ Edit Ingredient" : "➕ Add New Ingredient"}
            </SectionTitle>

            <Form onSubmit={submitIngredient}>
              <FormRow>
                <FormGroup>
                  <Label>Ingredient Name *</Label>
                  <Input
                    placeholder="e.g. Vanilla Syrup"
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Price *</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="e.g. 2"
                    value={newIngredient.price}
                    onChange={(e) => setNewIngredient({ ...newIngredient, price: e.target.value })}
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>Description</Label>
                <Input
                  placeholder="Short description..."
                  value={newIngredient.description}
                  onChange={(e) => setNewIngredient({ ...newIngredient, description: e.target.value })}
                />
              </FormGroup>

              <CheckboxLabel>
                <input
                  type="checkbox"
                  checked={newIngredient.isInStock}
                  onChange={(e) => setNewIngredient({ ...newIngredient, isInStock: e.target.checked })}
                />
                <span>In Stock</span>
              </CheckboxLabel>

              <ButtonRow>
                <SubmitButton type="submit">
                  {editingIngredient ? "💾 Save Changes" : "➕ Add Ingredient"}
                </SubmitButton>
                {editingIngredient && (
                  <CancelButton type="button" onClick={cancelEdit}>
                    ✕ Cancel
                  </CancelButton>
                )}
              </ButtonRow>
            </Form>

            <Divider />

            <ListTitle>🧪 All Ingredients ({ingredients.length})</ListTitle>
            <ItemList>
              {ingredients.length === 0 ? (
                <EmptyState>No ingredients yet. Add your first ingredient above!</EmptyState>
              ) : (
                ingredients.map((i) => (
                  <ItemCard key={i.id}>
                    <ItemInfo>
                      <ItemName>
                        <IngredientIcon>{getIngredientIcon(i.name)}</IngredientIcon>
                        {i.name}
                      </ItemName>
                      <ItemDetails>
                        <ItemPrice>+{convertPrice(i.price)}</ItemPrice>
                        <StockBadge $inStock={i.isInStock}>
                          {i.isInStock ? "Available" : "Unavailable"}
                        </StockBadge>
                      </ItemDetails>
                      <ItemDescription>{i.description}</ItemDescription>
                      <UsedInCoffees>
                        Used in: {coffees.filter((c) => c.ingredients.includes(String(i.id))).map((c) => c.title).join(", ") || "None"}
                      </UsedInCoffees>
                    </ItemInfo>
                    <ItemActions>
                      <EditButton
                        onClick={() => {
                          setEditingIngredient(i);
                          setNewIngredient({
                            name: i.name,
                            price: i.price,
                            description: i.description || "",
                            isInStock: i.isInStock,
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        ✏️ Edit
                      </EditButton>
                      <DeleteButton onClick={() => {
                        if (window.confirm(`Delete "${i.name}"? This will remove it from all coffees.`)) {
                          deleteIngredient(i.id);
                        }
                      }}>
                        🗑️ Delete
                      </DeleteButton>
                    </ItemActions>
                  </ItemCard>
                ))
              )}
            </ItemList>
          </Section>
        )}
      </MainContent>
    </Container>
  );
}

function getIngredientIcon(name) {
  const icons = {
    "Chocolate Syrup": "🍫",
    "Caramel Syrup": "🍯",
    "Whipped Cream": "🍦",
    "Cinnamon": "🌿",
    "Vanilla Syrup": "🌸",
    "Hazelnut Syrup": "🌰",
  };
  return icons[name] || "✨";
}

/* Styled Components - Matching Home Page Colors */
const Container = styled.div`
  font-family: "Inter", sans-serif;
  min-height: 100vh;
  width: 100%;
  background: #f5f5f5;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
`;

const LoadingText = styled.p`
  color: #1f1f22;
  font-size: 20px;
`;

const Hero = styled.div`
  width: 100%;
  height: 200px;
  background: url("/images/hero.jpg") center/cover no-repeat;
  position: relative;
`;

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;

  @media (max-width: 600px) {
    padding: 15px 20px;
    flex-wrap: wrap;
    gap: 15px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CoffeeIconImg = styled.span`
  font-size: 24px;
`;

const LogoText = styled.span`
  font-weight: 600;
  font-size: 18px;
  color: #fff;
  letter-spacing: 1px;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const BackButton = styled(Link)`
  background: rgba(255, 255, 255, 0.9);
  color: #1f1f22;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    background: #fff;
  }
`;

const CurrencyButton = styled.button`
  background: #1f1f22;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #333;
  }
`;

const HeroContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 42px;
  color: #fff;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 600px) {
    font-size: 32px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 16px;
  color: #fff;
  margin: 0;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
`;

const MainContent = styled.main`
  padding: 40px 50px;

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  background: ${(props) => (props.$active ? "#1f1f22" : "#fff")};
  color: ${(props) => (props.$active ? "#fff" : "#666")};
  border: 1px solid ${(props) => (props.$active ? "#1f1f22" : "#ddd")};
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  &:hover {
    border-color: #1f1f22;
    color: ${(props) => (props.$active ? "#fff" : "#1f1f22")};
  }

  @media (max-width: 600px) {
    padding: 12px 20px;
    font-size: 14px;
    flex: 1;
  }
`;

const Section = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  color: #1f1f22;
  margin: 0 0 25px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 12px 16px;
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #1f1f22;
  font-size: 15px;
  transition: border-color 0.3s, box-shadow 0.3s;

  &:focus {
    outline: none;
    border-color: #c9a86c;
    box-shadow: 0 0 0 3px rgba(201, 168, 108, 0.1);
  }

  &::placeholder {
    color: #aaa;
  }
`;

const PriceInputRow = styled.div`
  display: flex;
  gap: 10px;

  input {
    flex: 1;
  }
`;

const SuggestButton = styled.button`
  background: #c9a86c;
  color: #fff;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: #b8975b;
  }
`;

const PriceHint = styled.span`
  font-size: 12px;
  color: #888;
`;

const IngredientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
`;

const IngredientCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: ${(props) => (props.$selected ? "rgba(201, 168, 108, 0.1)" : "#f8f8f8")};
  border: 2px solid ${(props) => (props.$selected ? "#c9a86c" : "#e8e8e8")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #c9a86c;
  }

  span {
    color: #1f1f22;
    font-size: 14px;
  }
`;

const CheckboxIcon = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${(props) => (props.$selected ? "#c9a86c" : "#ccc")};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9a86c;
  font-size: 14px;
  font-weight: bold;
  background: ${(props) => (props.$selected ? "#c9a86c" : "transparent")};
  color: ${(props) => (props.$selected ? "#fff" : "transparent")};
`;

const IngredientPriceTag = styled.span`
  margin-left: auto;
  color: #c9a86c !important;
  font-weight: 600;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    accent-color: #c9a86c;
  }

  span {
    color: #1f1f22;
    font-size: 14px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const SubmitButton = styled.button`
  background: #c9a86c;
  color: #fff;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;

  &:hover {
    background: #b8975b;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(201, 168, 108, 0.3);
  }
`;

const CancelButton = styled.button`
  background: #fff;
  color: #e57373;
  border: 1px solid #e57373;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e57373;
    color: #fff;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e8e8e8;
  margin: 35px 0;
`;

const ListTitle = styled.h3`
  font-size: 18px;
  color: #1f1f22;
  margin: 0 0 20px 0;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-style: italic;
`;

const ItemCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  background: #f8f8f8;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: #c9a86c;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  @media (max-width: 700px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const ItemName = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #1f1f22;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IngredientIcon = styled.span`
  font-size: 22px;
`;

const ItemDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
`;

const ItemPrice = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #c9a86c;
`;

const StockBadge = styled.span`
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 20px;
  background: ${(props) => (props.$inStock ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)")};
  color: ${(props) => (props.$inStock ? "#4caf50" : "#f44336")};
  border: 1px solid ${(props) => (props.$inStock ? "#4caf50" : "#f44336")};
`;

const ItemIngredients = styled.span`
  font-size: 13px;
  color: #888;
`;

const ItemDescription = styled.span`
  font-size: 13px;
  color: #777;
`;

const UsedInCoffees = styled.span`
  font-size: 12px;
  color: #999;
  font-style: italic;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const EditButton = styled.button`
  background: #fff;
  color: #1f1f22;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1f1f22;
    color: #fff;
    border-color: #1f1f22;
  }

  @media (max-width: 700px) {
    flex: 1;
  }
`;

const DeleteButton = styled.button`
  background: #fff;
  color: #e57373;
  border: 1px solid #e57373;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e57373;
    color: #fff;
  }

  @media (max-width: 700px) {
    flex: 1;
  }
`;
