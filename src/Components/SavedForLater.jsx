import { useState, useEffect, useContext } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router";
import { AppContext } from "../Contexts/AppContext";
import { api_config } from "../Config/api"; 
import "../styles/cartPage.css";

export default function SavedForLater() {
  const [savedItems, setSavedItems] = useState([]);
  const navigate = useNavigate();

  const { addToFavorites, isFavorite, removeFromFavorites, formatPrice, lang } =
    useContext(AppContext);

  useEffect(() => {
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.PRODUCTS}`, {
      method: "GET",
      headers: {
        "Accept-Language": lang,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 1 && result.data) {
          setSavedItems(result.data.slice(5, 9));
        }
      })
      .catch((err) => console.error("Error fetching saved items:", err));
  }, [lang]);

  const handleFav = (e, item, isFav) => {
    e.stopPropagation();
    e.preventDefault();
    if (isFav) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item.id);
    }
  };

  if (!savedItems || savedItems.length === 0) return null;

  return (
    <div className="saved-for-later-section bg-white-theme border rounded p-3 p-md-4 mt-4 shadow-sm">
      <h5 className="fw-bold text-main-theme mb-4">Saved for later</h5>
      <Row className="g-3">
        {savedItems.map((item) => {
          const isFav = isFavorite(item.id);
          return (
            <Col xs={6} md={3} key={item.id}>
              <Card
                className="h-100 shadow-none border-0 bg-transparent bottom-related-card position-relative saved-item-card"
                onClick={() => {
                  navigate(`/product/${item.id}`);
                  window.scrollTo(0, 0);
                }}
              >
                <button
                  className="related-fav-btn position-absolute"
                  onClick={(e) => handleFav(e, item, isFav)}
                  title="Add to Favorites"
                >
                  {isFav ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                </button>

                <div className="border rounded mb-3 p-3 d-flex align-items-center justify-content-center bg-light-theme position-relative overflow-hidden bottom-related-img-box saved-item-img-box">
                  <Card.Img
                    variant="top"
                    src={item.image}
                    className="saved-item-img"
                  />
                </div>

                <Card.Body className="d-flex flex-column p-0 mt-2">
                  <div className="fw-bold text-main-theme mb-1 saved-item-price">
                    {formatPrice(item.price)}
                  </div>
                  <div className="text-muted-theme mb-0 saved-item-title">
                    {item.name || item.title}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
