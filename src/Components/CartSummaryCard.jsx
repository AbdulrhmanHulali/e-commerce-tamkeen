import { useContext } from "react";
import { Button } from "react-bootstrap";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcApplePay,
} from "react-icons/fa";
import { AppContext } from "../Contexts/AppContext";

export default function CartSummaryCard({
  subtotal,
  isCheckoutDisabled,
  onCheckout,
}) {
  const discount = 0;
  const tax = subtotal > 0 ? 14.0 : 0;
  const total = subtotal - discount + tax;
  const { formatPrice } = useContext(AppContext);

  return (
    <div className="cart-summary-card border rounded p-3 p-md-4 bg-white-theme shadow-sm text-start">
      <div className="summary-details">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted-theme fw-medium">Subtotal:</span>
          <span className="fw-medium text-main-theme">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted-theme fw-medium">Discount:</span>
          <span className="text-danger">-{formatPrice(discount)}</span>
        </div>
        <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
          <span className="text-muted-theme fw-medium">Tax:</span>
          <span className="text-success">+{formatPrice(tax)}</span>
        </div>
        <div className="d-flex justify-content-between mb-4 mt-2">
          <span className="fw-bold text-main-theme fs-5">Total:</span>
          <span className="fw-bold text-main-theme fs-5">
            {formatPrice(total)}
          </span>
        </div>
      </div>
      <Button
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
        className={`w-100 py-3 fw-bold shadow-none mb-3 checkout-btn fs-5 text-white ${
          isCheckoutDisabled ? "opacity-50" : ""
        }`}
      >
        Checkout
      </Button>

      <div className="payment-methods text-center mt-3">
        <div className="d-flex justify-content-center gap-2 text-muted-theme">
          <FaCcVisa size={30} />
          <FaCcMastercard size={30} />
          <FaCcPaypal size={30} />
          <FaCcApplePay size={30} />
        </div>
      </div>
    </div>
  );
}