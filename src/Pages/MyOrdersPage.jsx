import React, { useState, useEffect, useContext } from "react";
import { Container, Button, Spinner, Modal, Form } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight, FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router";
import { AppContext } from "../Contexts/AppContext";
import OrderCard from "../Components/OrderCard";
import { api_config } from "../Config/api";

import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/myorders.css";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const { lang } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(() => {
    return !!localStorage.getItem("user_token");
  });
  const [activeFilter, setActiveFilter] = useState("All");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState(null);

  const filters = ["All", "PENDING", "ACCEPTED", "CANCELED"];

  const filteredOrders =
    activeFilter === "All"
      ? orders
      : orders.filter((order) => order.status === activeFilter);

  useEffect(() => {
    AOS.refresh();
  }, [filteredOrders]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      mirror: false,
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("user_token");

    if (!token) {
      return;
    }

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.ORDERS}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((serverError) => {
            throw new Error(serverError.message || "Error fetching orders");
          });
        }
        return res.json();
      })
      .then((result) => {
        if (result.code === 1) {
          setOrders(result.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [lang]);

  const handleOpenCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) return;

    setIsCancelling(true);
    const token = localStorage.getItem("user_token");

    fetch(
      `${api_config.BASE_URL}${api_config.ENDPOINTS.ORDERS}/${selectedOrderId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Accept-Language": lang,
        },
        body: JSON.stringify({
          comment: cancelReason,
        }),
      },
    )
      .then((res) => {
        if (!res.ok) {
          return res.json().then((serverError) => {
            throw new Error(serverError.message || "Failed to cancel order");
          });
        }
        return res.json();
      })
      .then((result) => {
        if (result.code === 1) {
          setOrders((prev) =>
            prev.map((order) =>
              order.id === selectedOrderId
                ? { ...order, status: "CANCELED" }
                : order,
            ),
          );
          setShowCancelModal(false);
          alert("Order canceled successfully");
        } else {
          alert(result.message || "Failed to cancel order");
        }
      })
      .catch((err) => {
        console.error("Cancel Error:", err);
        alert(err.message || "An error occurred while cancelling the order");
      })
      .finally(() => {
        setIsCancelling(false);
      });
  };
  return (
    <div className="py-5 orders-page-wrapper">
      <Container className="orders-container">
        <button
          className="orders-back-btn mb-4"
          onClick={() => navigate("/profile")}
          data-aos="fade-right"
        >
          {lang === "ar" ? <FaArrowRight /> : <FaArrowLeft />}
          <span>Back to Profile</span>
        </button>
        <div className="orders-header-section mb-5" data-aos="fade-down">
          <h1 className="fw-bold text-main-theme display-5 mb-3">My Orders</h1>
          <p className="text-muted fs-6">
            View and track your recent orders and their current statuses.
          </p>
        </div>
        <div
          className="orders-filter-container d-flex flex-wrap gap-3 mb-5 pb-4 border-bottom border-secondary border-opacity-10"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              className={`order-filter-btn ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="orders-list-container">
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Loading your orders...</p>
            </div>
            ) : error ? (
            <div className="text-center py-5 empty-orders-state">
              <div className="text-danger mb-3">
                <i className="fas fa-exclamation-triangle fa-3x"></i>
              </div>
              <h4 className="text-main-theme fw-bold mb-3">Oops! Something went wrong</h4>
              <p className="text-muted">{error}</p>
              <Button
                variant="outline-primary"
                className="px-4 py-2 fw-bold mt-2"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <div
                key={order.id}
                data-aos="fade-up"
                data-aos-delay={100 + index * 50}
              >
                <OrderCard order={order} onCancel={handleOpenCancelModal} />
              </div>
            ))
          ) : (
            <div
              className="text-center py-5 empty-orders-state"
            >
              <FaBoxOpen size={65} className="text-muted mb-4 opacity-50" />
              <h4 className="text-main-theme fw-bold mb-3">No Orders Found</h4>
              <Button
                variant="primary"
                className="px-5 py-2 fw-bold empty-state-shop-btn"
                onClick={() => navigate("/")}
              >
                Start Shopping
              </Button>
            </div>
          )}
        </div>
        <Modal
          show={showCancelModal}
          onHide={() => !isCancelling && setShowCancelModal(false)}
          centered
          className="custom-cancel-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              Cancel Order{" "}
              <span className="cancel-order-id">#{selectedOrderId}</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label className="fw-medium small mb-2">
                Reason for cancellation
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Please tell us why you want to cancel..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="custom-input shadow-none"
              />
            </Form.Group>

            <div className="mt-3 p-2 rounded-3 cancel-warning-box">
              <small className="d-block small fw-medium">
                * Note: Cancellations are only possible for PENDING or ACCEPTED
                orders.
              </small>
            </div>
          </Modal.Body>
          <Modal.Footer className="gap-2">
            <Button
              className="rounded-pill px-4 fw-bold shadow-sm btn-cancel-confirm"
              onClick={handleConfirmCancel}
              disabled={isCancelling || !cancelReason.trim()}
            >
              {isCancelling ? (
                <>
                  <Spinner size="sm" className="me-2" /> Processing...
                </>
              ) : (
                "Confirm Cancel"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default MyOrdersPage;
