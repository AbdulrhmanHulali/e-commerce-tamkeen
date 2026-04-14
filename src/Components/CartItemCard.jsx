import { useContext } from "react";
import { Button } from "react-bootstrap";
import { FaTrashAlt, FaRegHeart, FaHeart } from "react-icons/fa";
import { AppContext } from "../Contexts/AppContext";

export default function CartItemCard({
  item,
  updateQuantity,
  removeFromCart,
  isSelected,
  onToggleSelect,
}) {
  // تعريف تابع تغيير السعر حسب العملة
  const { addToFavorites, isFavorite,removeFromFavorites, formatPrice } = useContext(AppContext);
  const isFav = isFavorite(item.id);

  return (
    <div className="cart-item-card d-flex flex-column flex-md-row gap-3 p-3 p-md-4 border-bottom bg-white-theme">
      <div className="d-flex align-items-center gap-3 flex-shrink-0">
        <div className="form-check m-0">
          <input
            className="form-check-input shadow-none border-secondary cart-item-checkbox"
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(item.id)}
          />
        </div>

        <div className="cart-item-img border rounded p-2 d-flex align-items-center justify-content-center bg-white-theme">
          <img
            src={item.image}
            alt={item.title}
            className="img-fluid object-fit-contain cart-item-image"
          />
        </div>
      </div>

      <div className="cart-item-details flex-grow-1 d-flex flex-column justify-content-between">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
          <div className="text-start">
            <h6 className="text-main-theme fw-bold mb-1 cart-item-title">
              {item.title}
            </h6>
            <p className="text-muted-theme mb-1 cart-item-text-sm">
              {item.details}
            </p>
            <p className="text-muted-theme mb-2 cart-item-text-sm">
              Seller: {item.seller}
            </p>
          </div>
          <div className="text-md-end text-start flex-shrink-0 mt-2 mt-md-0">
            <div className="fw-bold text-main-theme mb-1 cart-item-price-total">
              {/* استدعاء تابع تغيير العملة */}
              {formatPrice(item.price * item.quantity)}
            </div>
            <div className="text-muted-theme cart-item-price-unit">
              {" "}
              {/* استدعاء تابع تغيير العملة */}
              {formatPrice(item.price)} / pc
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mt-3 gap-3">
          <div className="d-flex gap-2">
            <Button
              variant="outline-danger"
              className="d-flex align-items-center gap-2 px-2 py-1 shadow-none btn-remove border-0 cart-action-btn"
              onClick={() => removeFromCart(item.id)}
            >
              <FaTrashAlt /> Remove
            </Button>
            <Button
              variant="outline-secondary"
              className={`d-flex align-items-center gap-2 px-2 py-1 shadow-none btn-save-later border border-secondary border-opacity-25 cart-action-btn ${isFav ? "text-danger" : "text-main-theme"}`}
              onClick={() => {
                  if (isFav) {
                removeFromFavorites(item.id);
              } else {
                addToFavorites(item.id); 
              }
              }}
            >
              {isFav ? <FaHeart /> : <FaRegHeart />}
              {isFav ? "Saved to Favorites" : "Add to Favorites"}
            </Button>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="text-muted-theme fw-medium cart-qty-label">
              Qty:
            </span>
            <div className="d-flex align-items-center border border-secondary border-opacity-50 rounded bg-transparent qty-container">
              <button
                className="btn px-2 shadow-none text-main-theme bg-transparent border-0 d-flex align-items-center justify-content-center qty-btn"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="px-3 fw-bold text-main-theme border-start border-end border-secondary border-opacity-50 bg-transparent d-flex align-items-center justify-content-center h-100 qty-display">
                {item.quantity}
              </span>

              <button
                className="btn px-2 shadow-none text-main-theme bg-transparent border-0 d-flex align-items-center justify-content-center qty-btn"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
