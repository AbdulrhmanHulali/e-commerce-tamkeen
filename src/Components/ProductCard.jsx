import { Card } from "react-bootstrap";
import { useNavigate } from "react-router";
import "../styles/productcard.css";
import { useContext } from "react";
import { AppContext } from "../Contexts/AppContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function ProductCard({ id, image, title, discount, price }) {
  const navigate = useNavigate();

  const { addToFavorites, isFavorite, removeFromFavorites, formatPrice } =
    useContext(AppContext);
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
    <Card
      onClick={() => navigate(`/product/${id}`)}
      className="product-card d-flex flex-column align-items-center justify-content-center p-3 rounded-0"
    >
      <button
        className="card-fav-btn position-absolute"
        onClick={handleFav}
        title="Add to Favorites"
      >
        {isFav ? <FaHeart className="text-danger" /> : <FaRegHeart />}
      </button>

      <div className="product-image-container">
        <Card.Img
          src={image}
          alt={title}
          className="product-image"
          bsPrefix="img"
        />
      </div>
      <Card.Text className="product-title">{title}</Card.Text>
      <Card.Text className="product-price fw-bold">
        {formatPrice(price)}
      </Card.Text>
      <span className="discount-badge">{discount}</span>
    </Card>
  );
}
