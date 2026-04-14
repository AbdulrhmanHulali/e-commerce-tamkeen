import { useContext, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { FaArrowLeft } from "react-icons/fa";
import { AppContext } from "../Contexts/AppContext";

import CartItemCard from "../Components/CartItemCard";
import CartSummaryCard from "../Components/CartSummaryCard";
import CartFeatures from "../Components/CartFeatures";
import SavedForLater from "../Components/SavedForLater";
import DiscountBanner from "../Components/ProductDetails/DiscountBanner";
import "../styles/cartPage.css";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } =
    useContext(AppContext);
  const navigate = useNavigate();

  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItemIds(cartItems.map((item) => item.id));
    } else {
      setSelectedItemIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedItemIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const isAllSelected =
    cartItems.length > 0 && selectedItemIds.length === cartItems.length;
  const selectedItemsData = cartItems.filter((item) =>
    selectedItemIds.includes(item.id),
  );

  const subtotal = selectedItemsData.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const isCheckoutDisabled = selectedItemIds.length === 0;

  const handleCheckout = () => {
    navigate("/checkout", {
      state: { selectedItemsForCheckout: selectedItemsData },
    });
  };

  return (
    <div className="cart-page-wrapper py-4 py-md-5">
      <Container>
        <h3 className="fw-bold text-main-theme mb-4 text-start">
          My cart ({cartItems.length})
        </h3>

        {cartItems.length === 0 ? (
          <div className="text-center py-5 bg-white-theme border rounded shadow-sm">
            <h4 className="text-muted-theme mb-3">Your cart is empty!</h4>
            <p className="text-muted-theme mb-4">
              Browse our categories and discover our best deals!
            </p>
            <Button
              as={Link}
              to="/"
              variant="primary"
              className="px-4 py-2 fw-bold shadow-none"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <Row className="g-4">
              <Col lg={8}>
                <div className="d-flex align-items-center gap-3 p-3 mb-3 bg-white-theme border rounded shadow-sm">
                  <div className="form-check m-0">
                    <input
                      className="form-check-input shadow-none border-secondary cart-item-checkbox"
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                    />
                  </div>
                  <span className="fw-medium text-main-theme fs-6">
                    Select the items you want to confirm for purchase
                  </span>
                </div>

                <div className="cart-items-container border rounded shadow-sm overflow-hidden mb-3 bg-white-theme">
                  {cartItems.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      updateQuantity={updateQuantity}
                      removeFromCart={removeFromCart}
                      isSelected={selectedItemIds.includes(item.id)}
                      onToggleSelect={handleToggleSelect}
                    />
                  ))}
                  <div className="d-flex justify-content-between align-items-center p-3 p-md-4">
                    <Button
                      as={Link}
                      to="/"
                      variant="light"
                      className="d-flex align-items-center gap-2 px-3 shadow-none back-to-shop-btn fw-medium"
                    >
                      <FaArrowLeft /> Back to shop
                    </Button>

                    <Button
                      variant="light"
                      className="px-3 shadow-none fw-medium remove-all-btn"
                      onClick={clearCart}
                    >
                      Remove all
                    </Button>
                  </div>
                </div>
              </Col>

              <Col lg={4}>
                <CartSummaryCard
                  subtotal={subtotal}
                  isCheckoutDisabled={isCheckoutDisabled}
                  onCheckout={handleCheckout}
                />
              </Col>
            </Row>
            <CartFeatures />
          </>
        )}
        <SavedForLater />
        <DiscountBanner />
      </Container>
    </div>
  );
}
