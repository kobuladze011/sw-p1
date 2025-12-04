// src/pages/single_Coffee.jsx
import React from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import { useCurrency } from "../components/CurrencyContext";
import { useCoffeeData } from "../hooks/useCoffeeData";

export default function SingleCoffee() {
  const { id } = useParams();
  const { currency, toggleCurrency, convertPrice } = useCurrency();
  const { coffees, ingredients, loading, error } = useCoffeeData();

  if (loading) return <LoadingScreen>Loading coffee details...</LoadingScreen>;
  if (error) return <ErrorScreen>Error loading coffee</ErrorScreen>;

  const coffee = coffees.find((c) => c.id === id);

  if (!coffee) {
    return (
      <Container>
        <MainContent>
          <ErrorText>Coffee not found</ErrorText>
          <BackLink to="/coffees">← Back to Coffees</BackLink>
        </MainContent>
      </Container>
    );
  }

  // Get the ingredient details for this coffee
  const coffeeIngredients = coffee.ingredients
    .map((ingredientId) => ingredients.find((ing) => String(ing.id) === String(ingredientId)))
    .filter(Boolean);

  // Calculate total price
  const ingredientsTotal = coffeeIngredients.reduce((sum, ing) => sum + ing.price, 0);
  const totalPrice = coffee.coffeePrice;

  return (
    <Container>
      {/* Hero Section with Header */}
      <Hero>
        <Header>
          <Logo>
            <CoffeeIcon>☕</CoffeeIcon>
            <LogoText>Coffee Shop</LogoText>
          </Logo>
          <NavButtons>
            <NavButton to="/">Home</NavButton>
            <CurrencyButton onClick={toggleCurrency}>{currency}</CurrencyButton>
          </NavButtons>
        </Header>
      </Hero>

      {/* Main Content */}
      <MainContent>
        <BackLink to="/coffees">← Back to Coffees</BackLink>

        <DetailCard>
          <DetailHeader>
            <CoffeeImage>
              <img src={getCoffeeImage(coffee.title)} alt={coffee.title} />
            </CoffeeImage>
            <CoffeeInfo>
              <CoffeeTitle>{coffee.title}</CoffeeTitle>
              <StockBadge $inStock={coffee.isInStock}>
                {coffee.isInStock ? "In Stock" : "Out of Stock"}
              </StockBadge>
              <CoffeeDescription>{coffee.description}</CoffeeDescription>
              <PriceTag>{convertPrice(totalPrice)}</PriceTag>
            </CoffeeInfo>
          </DetailHeader>

          <Divider />

          <SectionTitle>Included Ingredients</SectionTitle>
          {coffeeIngredients.length > 0 ? (
            <IngredientsList>
              {coffeeIngredients.map((ingredient) => (
                <IngredientItem key={ingredient.id} to={`/ingredients/${ingredient.id}`}>
                  <IngredientIcon>{getIngredientIcon(ingredient.name)}</IngredientIcon>
                  <IngredientInfo>
                    <IngredientName>{ingredient.name}</IngredientName>
                    <IngredientDesc>{ingredient.description}</IngredientDesc>
                  </IngredientInfo>
                  <IngredientPrice>+{convertPrice(ingredient.price)}</IngredientPrice>
                </IngredientItem>
              ))}
            </IngredientsList>
          ) : (
            <NoIngredients>No extra ingredients in this coffee</NoIngredients>
          )}
        </DetailCard>
      </MainContent>
    </Container>
  );
}

function getCoffeeImage(title) {
  const images = {
    "Latte": "/images/cappuccino.jpg",
    "Cappuccino": "/images/cappuccino.jpg",
    "Mocha": "/images/mocha.jpg",
    "Caramel Latte": "/images/caramel.jpg",
    "Vanilla Coffee": "/images/americano.avif",
  };
  return images[title] || "/images/cappuccino.jpg";
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

/* Styled Components */
const Container = styled.div`
  font-family: "Inter", sans-serif;
  min-height: 100vh;
  width: 100%;
  background: #f5f5f5;
`;

const Hero = styled.div`
  width: 100%;
  height: 120px;
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
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CoffeeIcon = styled.span`
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
`;

const NavButton = styled(Link)`
  background: #2d3748;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.3s;

  &:hover {
    background: #4a5568;
  }
`;

const CurrencyButton = styled.button`
  background: #1f1f22;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #333;
  }
`;

const MainContent = styled.main`
  padding: 30px 50px 60px;
  max-width: 900px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-block;
  color: #c9a86c;
  text-decoration: none;
  font-size: 15px;
  margin-bottom: 25px;
  font-weight: 500;
  transition: color 0.3s;

  &:hover {
    color: #a88a4c;
  }
`;

const DetailCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

const DetailHeader = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const CoffeeImage = styled.div`
  width: 280px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 600px) {
    width: 100%;
    height: 200px;
  }
`;

const CoffeeInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CoffeeTitle = styled.h1`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 36px;
  color: #1f1f22;
  margin: 0;
`;

const StockBadge = styled.span`
  display: inline-block;
  width: fit-content;
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 20px;
  background: ${(props) => (props.$inStock ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)")};
  color: ${(props) => (props.$inStock ? "#4caf50" : "#f44336")};
  border: 1px solid ${(props) => (props.$inStock ? "#4caf50" : "#f44336")};
  font-weight: 500;
`;

const CoffeeDescription = styled.p`
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0;
`;

const PriceTag = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: #c9a86c;
  margin-top: auto;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e8e8e8;
  margin: 30px 0;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  color: #1f1f22;
  margin: 0 0 20px 0;
`;

const IngredientsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const IngredientItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 16px;
  background: #f8f8f8;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
  border: 1px solid transparent;

  &:hover {
    background: #f0f0f0;
    border-color: #c9a86c;
    transform: translateX(5px);
  }
`;

const IngredientIcon = styled.span`
  font-size: 32px;
`;

const IngredientInfo = styled.div`
  flex: 1;
`;

const IngredientName = styled.span`
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #1f1f22;
`;

const IngredientDesc = styled.span`
  display: block;
  font-size: 13px;
  color: #888;
`;

const IngredientPrice = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #c9a86c;
`;

const NoIngredients = styled.p`
  font-size: 15px;
  color: #999;
  font-style: italic;
`;

const LoadingScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 20px;
  color: #666;
  background: #f5f5f5;
`;

const ErrorScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 20px;
  color: #f44336;
  background: #f5f5f5;
`;

const ErrorText = styled.p`
  font-size: 20px;
  color: #f44336;
  margin-bottom: 20px;
`;
