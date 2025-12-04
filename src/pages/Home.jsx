// src/pages/Home.jsx
import React from "react";
import styled from "styled-components";
import { useCurrency } from "../components/CurrencyContext";
import { useCoffeeData } from "../hooks/useCoffeeData";
import { Link } from "react-router-dom";

export default function Home() {
  const { convertPrice } = useCurrency();
  const { ingredients, coffees, loading, error } = useCoffeeData();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <Container>
      <Hero>
        <TitleDiv>
          <Titletext>Coffee Shop</Titletext>
          <Group25>
            <Coffees>Coffees</Coffees>
          </Group25>
        </TitleDiv>
        <Group23>
          <Symplyclever>SIMPLY CLEVER</Symplyclever>
          <COffees>BEST COFFEE</COffees>
          <LoremIpsum>Lorem Ipsum Dolor met sit dolor</LoremIpsum>
        </Group23>
        <Divider73 />
      </Hero>

      {/* Coffees Section */}
      <Section>
        <SectionTitle to={`/ingredients`}>All Ingredients</SectionTitle>
        <SectionTitle to={`/coffees/`}>All Coffees</SectionTitle>
      </Section>
    </Container>
  );
}

/* Styled Components */
const Container = styled.div`
  font-family: Arial, sans-serif;
  background: #f0eeed;
  width: 1440px;
  padding-bottom: 200px; /* extra space at the bottom */
`;

const Hero = styled.div`
  height: 653px;
  width: 1440px;
  background: url("/images/hero.jpg") center/cover no-repeat;
  display: flex;
  margin: 10px, 10px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Section = styled.div`
  padding: 40px 20px;
  padding-bottom: 80px;
  left: 1080px;
  transform: rotate(0deg);
  opacity: 1;
  margin-left: 108px;
`;

const SectionTitle = styled(Link)`
  display: inline-block; /* ensures clickable area */
  margin-bottom: 20px;
  background-color: transparent;
  color: black;
  font-family: "Inter", sans-serif;
  font-weight: 500;
  font-size: 36px;
  text-decoration: none;
  cursor: pointer;
  display: block;
`;

const TitleDiv = styled.div`
  width: 1236px; /* add units */
  height: 45px; /* add units */
  position: absolute; /* needed for top/left positioning */
  top: 11px;
  left: 102px;
  transform: rotate(0deg); /* replaces 'angle: 0 deg' */
  opacity: 1;
`;

const Titletext = styled.h1`
  width: 149px; /* add units */
  height: 24px; /* add units */
  position: absolute; /* needed if using top/left */
  top: 18px;
  left: 15px;
  transform: rotate(0deg); /* replaces angle */
  opacity: 1;
  font-family: "Inter", sans-serif;
  font-weight: 600; /* Semi-bold weight */
  font-style: normal; /* use 'normal' or 'italic', 'Semi Bold' is not valid */
  font-size: 20px; /* font size */
  line-height: 1; /* 100% = 1 in CSS */
  letter-spacing: 0.14em;
  color: #f0eeed;
`;

const Group25 = styled.div`
  width: 148px; /* add units */
  height: 45px; /* add units */
  position: absolute; /* needed for top/left positioning */
  top: 11px;
  left: 1100px;
  transform: rotate(0deg); /* replaces angle */
  opacity: 1;
  border-radius: 5px;
  background-color: #1f1f22;
`;

const Coffees = styled.h2`
  width: 76px; /* add units */
  height: 24px; /* add units */
  position: absolute; /* needed for top/left */
  top: 11px;
  left: 36px;
  transform: rotate(0deg); /* replaces angle */
  opacity: 1;
  font-family: "Inter", sans-serif; /* include fallback */
  font-weight: 500; /* medium weight */
  font-style: normal; /* Medium is not valid, use normal or italic */
  font-size: 20px; /* font size */
  line-height: 1; /* 100% line-height = 1 */
  letter-spacing: 0; /* 0% spacing = 0 */
  color: #f0eeed;
  margin: 0;
`;

const Group23 = styled.div`
  width: 649px;
  height: 248px;
  position: absolute;
  top: 107px;
  left: 87px; /* change this */
  transform: rotate(0deg);
  opacity: 1;
`;

const COffees = styled.p`
  color: #f0eeed;
  width: 649px;
  height: 112px;
  position: absolute;
  top: 35px;
  left: 0px;
  transform: rotate(0deg);
  opacity: 1;
  font-family: "High Tower Text", serif;
  font-weight: 400;
  font-style: normal; /* 'Regular' → normal */
  font-size: 96px;
  line-height: 1; /* 100% = 1 */
  letter-spacing: 0;
`;

const LoremIpsum = styled.p`
  width: 303px;
  height: 24px;
  position: absolute;
  top: 220px;
  left: 8px;
  transform: rotate(0deg);
  opacity: 1;
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-style: normal; /* 'Regular' → normal */
  font-size: 20px;
  line-height: 1; /* 100% = 1 */
  letter-spacing: 0;
  color: #fbfbfb;
`;
const Symplyclever = styled.p`
  width: 290px;
  height: 44px;
  position: absolute;
  top: 0;
  left: 8px;
  transform: rotate(0deg);
  opacity: 1;
  font-family: "Inter", sans-serif;
  font-weight: 500; /* Medium weight */
  font-style: normal; /* 'Medium' → normal in CSS */
  font-size: 36px;
  line-height: 1; /* 100% = 1 */
  letter-spacing: 0;
  color: #f0eeed;
`;

const Divider73 = styled.div`
  width: 496px;
  height: 1px;
  position: absolute;
  top: 404px;
  left: 86px;
  transform: rotate(0deg);
  opacity: 1;
  background-color: #ffffff;
`;
