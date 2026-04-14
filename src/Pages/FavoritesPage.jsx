import React, { useContext, useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import {
  FaArrowLeft,
  FaArrowRight,
  FaTrash,
  FaShoppingCart,
  FaHeart,
  FaTrashAlt,
  FaTh,
  FaThList,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { AppContext } from "../Contexts/AppContext";
import RecommendedSection from "../Components/RecommendedSection";
import { api_config } from "../../Config/API"; 
import "../styles/favorites.css";

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites, addToCart, lang, formatPrice } =
    useContext(AppContext);

  const [viewMode, setViewMode] = useState("grid");
  const [serverFavorites, setServerFavorites] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]); 
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(() => {
    return !!localStorage.getItem("user_token");
  });

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.SHOW_FAVORITE}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Language": lang,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 1) {
          const validItems = data.data.filter((item) => item.product !== null);
          setServerFavorites(validItems);
        } else {
          setError(data.message || "Failed to load your wishlist");
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [lang]);

  useEffect(() => {
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.PRODUCTS}`, {
      method: "GET",
      headers: { "Accept-Language": lang, Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 1 && result.data) {
          setRecommendedProducts(result.data.slice(0, 10)); 
        }
      })
      .catch((err) => console.error("Error fetching recommended products:", err));
  }, [lang]);

  const visibleFavorites = serverFavorites.filter((item) =>
    favorites.includes(item.product.id),
  );

  const handleAddAllToCart = () => {
    visibleFavorites.forEach((item) => {
      if (item.product) {
        addToCart({
          id: item.product.id,
          title: item.product.name,
          price: item.product.price,
          image: item.product.image,
        });
      }
    });
  };

  const handleClearFavorites = () => {
    visibleFavorites.forEach((item) => {
      if (item.product) {
        removeFromFavorites(item.product.id);
      }
    });
  };
  return (
    <div className="favorites-page-wrapper py-5">
      <Container className="py-4 text-start">
        {!isMobile && (
          <div className="d-flex mb-4">
            <button
              className="back-btn mb-4"
              onClick={() => navigate("/profile")}
            >
              {lang === "ar" ? (
                <FaArrowRight className="back-icon" />
              ) : (
                <FaArrowLeft className="back-icon" />
              )}
              <span>Back to Profile</span>
            </button>
          </div>
        )}

        <div className="fav-header mb-5 d-flex flex-column flex-lg-row justify-content-between align-items-start gap-4 w-100">
          <div className="w-100">
            <span className="fav-badge mb-3 d-inline-block">My Wishlist</span>
            <h2 className="display-5 fw-bold text-main-theme mb-2 d-flex align-items-center justify-content-start gap-3 w-100">
              Favorite Products
              <span className="badge bg-danger rounded-pill fs-5 px-3 shadow-sm">
                {visibleFavorites.length}
              </span>
            </h2>
            <p className="text-muted-theme mb-0 w-100">
              Keep the items you love in one place and access them anytime.
            </p>
          </div>

          {visibleFavorites.length > 0 && !isLoading && (
            <div className="d-flex flex-wrap gap-3 align-items-center justify-content-start w-100 w-lg-auto">
              {!isMobile && (
                <div className="d-flex align-items-center p-1 bg-card-theme rounded-pill shadow-sm border border-secondary border-opacity-10">
                  <Button
                    variant="link"
                    className={`d-flex align-items-center justify-content-center rounded-pill px-3 py-2 text-decoration-none transition-all ${
                      viewMode === "grid"
                        ? "bg-secondary bg-opacity-10 text-main-theme"
                        : "text-muted-theme"
                    }`}
                    onClick={() => setViewMode("grid")}
                    title="Grid View"
                  >
                    <FaTh size={18} />
                  </Button>
                  <Button
                    variant="link"
                    className={`d-flex align-items-center justify-content-center rounded-pill px-3 py-2 text-decoration-none transition-all ${
                      viewMode === "list"
                        ? "bg-secondary bg-opacity-10 text-main-theme"
                        : "text-muted-theme"
                    }`}
                    onClick={() => setViewMode("list")}
                    title="List View"
                  >
                    <FaThList size={18} />
                  </Button>
                </div>
              )}

              <Button
                variant="outline-danger"
                className="fav-action-btn fav-clear-btn d-flex align-items-center gap-2 px-4 py-2 shadow-sm rounded-pill fw-medium"
                onClick={handleClearFavorites}
              >
                <FaTrashAlt /> Clear Wishlist
              </Button>
              <Button
                variant="none"
                className="fav-action-btn fav-add-all-btn d-flex align-items-center gap-2 px-4 py-2 shadow-sm rounded-pill fw-medium text-white"
                onClick={handleAddAllToCart}
              >
                <FaShoppingCart /> Add All to Cart
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="danger" />
            <p className="mt-3 text-muted-theme">Loading favorites...</p>
          </div>
        ) : error ? (
          <div className="empty-fav-state shadow-sm rounded-4 bg-card-theme mb-5 text-center p-5">
            <div className="text-danger mb-4">
              <i className="fas fa-exclamation-triangle fa-3x"></i>
            </div>
            <h4 className="fw-bold text-main-theme">
              Oops! Something went wrong
            </h4>
            <p className="text-muted-theme mb-4">{error}</p>
            <button
              className="fav-add-cart-btn w-auto px-5 py-2 rounded-pill"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : visibleFavorites.length > 0 ? (
          <Row className="g-4 mb-5">
            {visibleFavorites.map((item) => {
              const product = item.product;

              return (
                <Col
                  key={product.id}
                  xs={12}
                  sm={viewMode === "grid" ? 6 : 12}
                  lg={viewMode === "grid" ? 4 : 12}
                  xl={viewMode === "grid" ? 3 : 12}
                >
                  <div
                    className={`fav-product-card h-100 shadow-sm d-flex flex-column ${viewMode === "list" ? "list-view" : ""}`}
                  >
                    <div className="fav-image-wrapper">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="fav-img img-fluid"
                      />
                      <button
                        className="fav-remove-btn"
                        onClick={() => removeFromFavorites(product.id)}
                        title="Remove"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    <div className="fav-content d-flex flex-column flex-grow-1 text-start">
                      <div className="fav-title-section">
                        <h6 className="fw-bold text-main-theme text-truncate mb-2">
                          {product.name}
                        </h6>
                        {!isMobile && viewMode === "list" && (
                          <p className="text-muted-theme mt-2 mb-0 fav-list-desc">
                            {product.description ||
                              "A highly recommended item from your wishlist."}
                          </p>
                        )}
                      </div>

                      <div className="mt-auto fav-action-section">
                        <div className="fav-price mb-3 fw-bold text-main-theme">
                          {formatPrice(product.price)}
                        </div>
                        <button
                          className="fav-add-cart-btn d-flex align-items-center justify-content-center gap-2"
                          onClick={() =>
                            addToCart({
                              id: product.id,
                              title: product.name,
                              price: product.price,
                              image: product.image,
                            })
                          }
                        >
                          <FaShoppingCart size={16} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        ) : (
          <div className="empty-fav-state shadow-sm rounded-4 bg-card-theme mb-5 text-center p-5">
            <div className="text-muted-theme mb-4">
              <FaHeart size={60} opacity={0.2} />
            </div>
            <h4 className="fw-bold text-main-theme">
              Your favorites list is empty
            </h4>
            <p className="text-muted-theme mb-4">
              Start adding products you like now!
            </p>
            <button
              className="fav-add-cart-btn w-auto px-5 py-2 rounded-pill"
              onClick={() => navigate("/")}
            >
              Explore Products
            </button>
          </div>
        )}
      </Container>

      <div className="mt-5 border-top border-secondary border-opacity-10 pt-5 text-start">
        <Container>
         <RecommendedSection recommendedItems={recommendedProducts} />
        </Container>
      </div>
    </div>
  );
};

export default FavoritesPage;
