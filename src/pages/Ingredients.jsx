// src/pages/Ingredients.jsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCurrency } from "../components/CurrencyContext";
import { useCoffeeData } from "../hooks/useCoffeeData";

export default function Ingredients() {
  const { currency, toggleCurrency, convertPrice } = useCurrency();
  const { ingredients, loading, error } = useCoffeeData();

  if (loading) return <LoadingScreen>Loading ingredients...</LoadingScreen>;
  if (error) return <ErrorScreen>Error loading ingredients</ErrorScreen>;

  return (
    <Container>
      {/* Hero Section with Header */}
      <Hero>
        <Header>
          <Logo>
            <CoffeeIcon>☕</CoffeeIcon>
            <LogoText>Coffee Shop</LogoText>
          </Logo>
          <NavButton to="/">Home</NavButton>
        </Header>
        <HeroContent>
          <SimplyClever>ADD-ONS</SimplyClever>
          <BestCoffee>INGREDIENTS</BestCoffee>
          <HeroSubtext>Premium add-ons for your perfect cup</HeroSubtext>
        </HeroContent>
      </Hero>

      {/* Main Content */}
      <MainContent>
        <SectionHeader>
          <SectionTitle>All Ingredients</SectionTitle>
          <CurrencyButton onClick={toggleCurrency}>{currency}</CurrencyButton>
        </SectionHeader>

        <CardGrid>
          {ingredients.map((ingredient) => (
            <Card key={ingredient.id} to={`/ingredients/${ingredient.id}`}>
              <CardImage>
                <IngredientEmoji>{getIngredientIcon(ingredient.name)}</IngredientEmoji>
              </CardImage>
              <CardInfo>
                <CardName>{ingredient.name}</CardName>
                <CardPrice>+{convertPrice(ingredient.price)}</CardPrice>
              </CardInfo>
              <StockBadge $inStock={ingredient.isInStock}>
                {ingredient.isInStock ? "Available" : "Unavailable"}
              </StockBadge>
              <QRCode>
                <QRIcon>⊞</QRIcon>
              </QRCode>
            </Card>
          ))}
        </CardGrid>
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

/* Styled Components */
const Container = styled.div`
  font-family: "Inter", sans-serif;
  min-height: 100vh;
  width: 100%;
  background: #f5f5f5;
`;

const Hero = styled.div`
  width: 100%;
  height: 250px;
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

const NavButton = styled(Link)`
  background: #2d3748;
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.3s;

  &:hover {
    background: #4a5568;
  }
`;

const HeroContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50px;
  transform: translateY(-50%);
`;

const SimplyClever = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: #f0eeed;
  margin: 0 0 8px 0;
  letter-spacing: 2px;
`;

const BestCoffee = styled.h1`
  font-family: "Playfair Display", "Times New Roman", serif;
  font-size: 48px;
  font-weight: 400;
  color: #f0eeed;
  margin: 0 0 12px 0;
  letter-spacing: 2px;
`;

const HeroSubtext = styled.p`
  font-size: 14px;
  color: #f0eeed;
  margin: 0;
  opacity: 0.9;
`;

const MainContent = styled.main`
  width: 100%;
  background: #f5f5f5;
  padding: 40px 50px 60px;
  min-height: calc(100vh - 250px);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #1f1f22;
  margin: 0;
`;

const CurrencyButton = styled.button`
  background: #1f1f22;
  color: #fff;
  border: none;
  padding: 10px 24px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #333;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
`;

const CardImage = styled.div`
  height: 160px;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f4f0, #efe8e0);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IngredientEmoji = styled.span`
  font-size: 64px;
`;

const CardInfo = styled.div`
  padding: 12px 15px;
  padding-right: 60px;
`;

const CardName = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: #1f1f22;
  margin: 0 0 4px 0;
`;

const CardPrice = styled.p`
  font-size: 13px;
  color: #c9a86c;
  margin: 0;
  font-weight: 600;
`;

const StockBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  background: ${(props) => (props.$inStock ? "rgba(76, 175, 80, 0.9)" : "rgba(244, 67, 54, 0.9)")};
  color: #fff;
  font-weight: 500;
`;

const QRCode = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QRIcon = styled.span`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
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
