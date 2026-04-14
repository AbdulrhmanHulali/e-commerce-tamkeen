import { Container } from "react-bootstrap";
import { Link } from "react-router";
import RecommendedItemCard from "./RecommendedItemCard";
import "../styles/recommendedSection.css";

export default function RecommendedSection({ recommendedItems = [] }) {
  if (!recommendedItems || recommendedItems.length === 0) return null;

  return (
    <Container className="mt-5 mb-5 ">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="recommended-section-title">Recommended items</h3>
        <Link to="/products" className="fw-bold more-link">
          More Products
        </Link>
      </div>
      <div className="recommended-grid">
        {recommendedItems.map((item) => (
          <div key={item.id} className="recommended-card-wrapper">
            <RecommendedItemCard
              id={item.id}
              image={item.image}
              price={item.price}
              title={item.name || item.title}
            />
          </div>
        ))}
      </div>
    </Container>
  );
}
