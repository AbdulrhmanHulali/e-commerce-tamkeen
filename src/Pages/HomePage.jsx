import { useState, useEffect, useContext } from "react";
import { Container } from "react-bootstrap";
import DealsSection from "../Components/DealsSection";
import CategorySection from "../Components/CategorySection";
import QuoteSection from "../Components/QuoteSection";
import RecommendedSection from "../Components/RecommendedSection";
import ExtraServicesSection from "../Components/ExtraServicesSection";
import SuppliersSection from "../Components/SuppliersSection";
import NewsletterSection from "../Components/NewsletterSection";
import HeroSection from "../Components/HeroSection";
import HomeSlider from "../Components/HomeSlider";
import "../styles/homePage.css";
import { api_config } from "../Config/api"; 
import { AppContext } from "../Contexts/AppContext";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const { lang } = useContext(AppContext);

  useEffect(() => {
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.PRODUCTS}`, {
      method: "GET",
      headers: { "Accept-Language": lang, Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 1) {
          setProducts(result.data);
        }
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, [lang]);

  const dealsProducts = products.slice(0, 4);
  const recommendedProducts = products.slice(5, 15);

  return (
    <div className="home-page-wrapper">
      <HomeSlider />
      <HeroSection />

      <DealsSection dealsData={dealsProducts} />

      <Container className="mt-3">
        <CategorySection />
      </Container>

      <QuoteSection />

      <RecommendedSection recommendedItems={recommendedProducts} />

      <ExtraServicesSection />
      <SuppliersSection />
      <NewsletterSection />
    </div>
  );
}
