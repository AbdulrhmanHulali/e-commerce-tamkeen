import { useContext } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { AppContext } from "../Contexts/AppContext";
import "../styles/productListCard.css";

export default function ProductListCard({ product, viewMode = "list" }) {
  const isGrid = viewMode === "grid";

  const { addToFavorites, isFavorite, removeFromFavorites, formatPrice } =
    useContext(AppContext);

  const isFav = product.is_favorite || isFavorite(product.id);

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };

  const renderFavoriteButton = (additionalClass = "") => (
    <Button
      variant="light"
      className={`favorite-btn border shadow-sm d-flex align-items-center justify-content-center ${additionalClass}`}
      onClick={handleToggleFavorite}
    >
      {isFav ? (
        <FaHeart className="text-danger favorite-icon" />
      ) : (
        <FaRegHeart className="text-accent favorite-icon" />
      )}
    </Button>
  );

  return (
    <Card
      className={`product-list-card shadow-sm border-0 position-relative ${isGrid ? "grid-view h-100 flex-column" : "list-view flex-column flex-md-row mb-3"}`}
    >
      <div className="product-list-image-wrapper d-flex align-items-center justify-content-center position-relative">
        <Link to={`/product/${product.id}`}>
          <Card.Img
            variant="top"
            src={product.image}
            alt={product.name}
            className="product-list-image"
          />
        </Link>
        {product.design && (
          <div
            className="position-absolute"
            style={{
              top: "10px",
              left: "10px",
              width: "40px",
              height: "40px",
              zIndex: 2,
            }}
          >
            <img
              src={product.design}
              alt="design"
              className="w-100 h-100 rounded-circle shadow-sm bg-white p-1"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {isGrid && renderFavoriteButton("position-absolute")}
      </div>

      <Card.Body
        className={`d-flex text-start ${isGrid ? "flex-column p-3" : "justify-content-between p-3 p-md-4 w-100"}`}
      >
        {isGrid ? (
          <div className="d-flex flex-column h-100">
            {product.category && (
              <span
                className="text-muted-theme small fw-medium mb-1"
                style={{ fontSize: "0.8rem" }}
              >
                {product.category.name}
              </span>
            )}

            <div className="mb-1">
              <span className="fw-bold fs-5 margin-end-2 text-main-theme">
                {formatPrice(product.price)}
              </span>
            </div>
            {product.sku && (
              <div className="text-muted-theme mb-2 fs-7">
                SKU: {product.sku}
              </div>
            )}

            <Link
              to={`/product/${product.id}`}
              className="text-decoration-none mt-auto"
            >
              <Card.Title
                className="fw-medium fs-6 mb-0 product-grid-title text-main-theme"
                title={product.name}
              >
                {product.name}
              </Card.Title>
            </Link>
          </div>
        ) : (
          <div className="d-flex w-100 justify-content-between position-relative">
            <div className="flex-grow-1 list-text-container">
              {product.category && (
                <Badge bg="light" text="secondary" className="mb-2 border">
                  {product.category.name}
                </Badge>
              )}
              <Link
                to={`/product/${product.id}`}
                className="text-decoration-none"
              >
                <Card.Title className="fw-bold mb-1 text-main-theme product-list-title">
                  {product.name}
                </Card.Title>
              </Link>
              {product.sku && (
                <div className="text-muted-theme small mb-2">
                  SKU: {product.sku}
                </div>
              )}

              <div className="mb-2">
                <span className="fw-bold fs-5 margin-end-2 text-main-theme">
                  {formatPrice(product.price)}
                </span>
              </div>

              {(product.short_description || product.description) && (
                <Card.Text className="mb-3 d-none d-md-block product-list-desc text-muted-theme mt-2">
                  {product.short_description || product.description}
                </Card.Text>
              )}

              <Link
                to={`/product/${product.id}`}
                className="product-list-link fw-medium text-decoration-none mt-2 d-inline-block"
              >
                View details
              </Link>
            </div>
            <div className="margin-start-3 d-flex flex-column align-items-end">
              {renderFavoriteButton("rounded-3")}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
