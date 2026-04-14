import { useContext } from "react";
import "../styles/categorySection.css";
import { useNavigate } from "react-router";
import { AppContext } from "../Contexts/AppContext";
export default function CategoryItemCard({id, title, price, image }) {
  const navigate = useNavigate();
  const {formatPrice} = useContext(AppContext)
  const handleClick = () => {
    navigate(`/category/${id}`);
  };
  return (
    <div className="category-item-card" onClick={handleClick}>
      <div className="category-item-info">
        <div className="category-item-title text-truncate" title={title}>
          {title}
        </div>
        <div className="category-item-price">
          <span>From</span> <br />
          <span> {formatPrice(price)}</span>
        </div>
      </div>
      <div className="category-item-image-wrapper">
        <img src={image} alt={title} className="category-item-image" />
      </div>
    </div>
  );
}
