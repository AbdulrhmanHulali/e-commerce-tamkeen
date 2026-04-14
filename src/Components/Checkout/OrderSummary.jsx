import React from "react";
import { Button, Form, InputGroup, Spinner } from "react-bootstrap";
import { FiPackage } from "react-icons/fi";

export default function OrderSummary({
  checkoutItems,
  formatPrice,
  subtotal,
  tax,
  netTotal,
  isFormValid,
  handleConfirmPayment,
  isPlacingOrder,
  couponCode,
  setCouponCode,
}) {
  return (
    <div className="checkout-summary-card">
      <h5 className="checkout-section-title mb-4 d-flex align-items-center gap-2">
        <FiPackage className="text-pink" /> Order Summary
      </h5>
      <div className="checkout-items-preview mb-4">
        {checkoutItems.length > 0 ? (
          checkoutItems.map((item, index) => (
            <div
              key={index}
              className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary border-opacity-10"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="item-img-wrapper">
                  <img
                    src={item.image || item.img}
                    alt={item.name}
                    className="checkout-item-img"
                  />
                  <span className="item-qty-badge qty-badge-pink">
                    {item.quantity}
                  </span>
                </div>
                <div className="text-truncate checkout-item-name-wrapper">
                  <small className="fw-bold text-main-theme d-block text-truncate mb-1">
                    {item.title || item.name}
                  </small>
                  <small className="text-muted-theme">
                    {formatPrice(item.price)}
                  </small>
                </div>
              </div>
              <small className="fw-bold text-pink">
                {formatPrice(item.price * item.quantity)}
              </small>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-theme mb-0">No items in your checkout.</p>
          </div>
        )}
      </div>
      <div className="mb-4">
        <InputGroup>
          <Form.Control
            placeholder="Enter coupon code"
            className="shadow-none checkout-notes-input"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <Button
            className="fw-medium px-4 shadow-none btn-apply-coupon"
            onClick={() => console.log("Checking Coupon:", couponCode)}
          >
            Apply
          </Button>
        </InputGroup>
      </div>

      <div className="pricing-row mb-2 d-flex justify-content-between">
        <span className="text-muted-theme">Subtotal</span>
        <span className="fw-medium text-main-theme">
          {formatPrice(subtotal)}
        </span>
      </div>
      <div className="pricing-row mb-2 d-flex justify-content-between">
        <span className="text-muted-theme">Tax</span>
        <span className="fw-medium text-main-theme">{formatPrice(tax)}</span>
      </div>
      <hr className="border-secondary opacity-25 my-3" />
      <div className="pricing-row total-row mb-4 d-flex justify-content-between align-items-center">
        <span className="total-label fw-bold fs-5 text-main-theme">
          Net Total
        </span>
        <span className="total-value fw-bold fs-4 text-pink">
          {formatPrice(netTotal)}
        </span>
      </div>

      <Button
        className="confirm-order-btn w-100 shadow-none fw-bold d-flex justify-content-center align-items-center gap-2"
        disabled={!isFormValid || isPlacingOrder}
        onClick={handleConfirmPayment}
      >
        {isPlacingOrder ? (
          <>
            <Spinner animation="border" size="sm" /> Processing...
          </>
        ) : (
          "Place Order"
        )}
      </Button>
    </div>
  );
}
