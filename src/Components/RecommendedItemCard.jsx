import { useNavigate } from "react-router";
import "../styles/recommendedSection.css";
import { useContext } from "react";
import { AppContext } from "../Contexts/AppContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function RecommendedItemCard({ id, image, price, title }) {
  const navigate = useNavigate();
  const { addToFavorites, isFavorite, formatPrice, removeFromFavorites } = useContext(AppContext);
  const isFav = isFavorite(id);
  const handleFav = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isFav) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id); 
    }
  };

  return (
    <div
      className="recommended-card position-relative overflow-hidden"
      onClick={() => navigate(`/product/${id}`)}
    >
      <button
        className="card-fav-btn position-absolute"
        onClick={handleFav}
        title="Add to Favorites"
      >
        {isFav ? <FaHeart className="text-danger" /> : <FaRegHeart />}
      </button>
      <div className="recommended-img-container">
        <img src={image} alt={title} className="recommended-img" />
      </div>      
      <div className="recommended-price">{formatPrice(price)}</div>
      <div className="recommended-desc">{title}</div>
    </div>
  );
}