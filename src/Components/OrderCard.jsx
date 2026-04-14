import React, { useContext } from "react";
import { Card, Button } from "react-bootstrap";
import { FiBox, FiChevronRight, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router";
import { AppContext } from "../Contexts/AppContext";

const OrderCard = ({ order, onCancel }) => {
  const navigate = useNavigate();
  const { formatPrice } = useContext(AppContext);
  const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) { 
    case "accepted": case "completed": return "status-delivered";
    case "processing": case "pending": return "status-processing";
    case "canceled": case "cancelled": return "status-cancelled";
    default: return "status-default";
  }
};

  const handleViewDetails = () => {
    navigate(`/orders/${order.id}`);
  };

  return (
    <Card className="order-item-card shadow-sm border-0 mb-4">
      <Card.Header className="order-card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center p-4 border-bottom border-secondary border-opacity-10">
        <div>
          <h6 className="fw-bold text-main-theme mb-1">
            Order <span className="text-accent">#{order.id}</span>
          </h6>
          <small className="text-muted">
            Placed on {order.created_at?.substring(0, 10) || "Recent"}
          </small>
        </div>
        <div className="mt-2 mt-md-0 d-flex align-items-center gap-3">
          <span
            className={`badge px-3 py-2 rounded-pill fw-medium ${getStatusStyle(order.status)}`}
          >
            {order.status}
          </span>
          <h5 className="fw-bold text-main-theme m-0">
            {formatPrice(order.grand_total)}
          </h5>
        </div>
      </Card.Header>

      <Card.Body className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
        <div className="d-flex align-items-center gap-3 mb-3 mb-md-0">
          <div className="order-icon-wrapper d-flex justify-content-center align-items-center">
            <FiBox size={24} />
          </div>
          <div>
            <p className="text-main-theme fw-medium mb-1">
              Check order details for items
            </p>
            <p className="text-muted small m-0 text-truncate order-items-preview-text">
              Payment Method: {order.payment_type}
            </p>
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap justify-content-md-end align-items-center">
          {order.status === "PENDING" && (
            <Button
              variant="outline-danger"
              className="d-flex justify-content-center align-items-center p-2 rounded-circle order-cancel-btn"
              onClick={() => onCancel(order.id)}
              title="Cancel Order"
            >
              <FiTrash2 size={18} />
            </Button>
          )}

          <Button
            variant="outline-primary"
            className="btn-outline-accent fw-bold d-flex justify-content-center align-items-center gap-2"
            onClick={handleViewDetails}
          >
            View Details <FiChevronRight />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderCard;
