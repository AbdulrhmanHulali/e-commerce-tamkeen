import React, { useContext, useState, useEffect } from "react";
import { Container, Card, Row, Col, Button, Spinner,Modal, Form } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  FiMapPin,
  FiTruck,
  FiCreditCard,
  FiPackage,
  FiTrash2,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import { AppContext } from "../Contexts/AppContext";
import { api_config } from "../../Config/API"; 

import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/orderdetails.css";

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const { lang, formatPrice } = useContext(AppContext);
  const { id } = useParams();

  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(() => {
    return !!localStorage.getItem("user_token");
  });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });

    const token = localStorage.getItem("user_token");

    if (!token) {
      return;
    }

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.ORDER_DETAILS}${id}`, {
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
            throw new Error(
              serverError.message || "Error loading order details",
            );
          });
        }
        return res.json();
      })
      .then((result) => {
        console.log("response:", result);
        if (result.code === 1) {
          setOrderData(result.data);
        }
        else {
          throw new Error(result.message || "Order not found");
        }
      })
      .catch((err) => {
        console.error("Error loading order details:", err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, lang]);

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "status-delivered";
      case "PENDING":
        return "status-processing";
      case "CANCELED":
        return "status-cancelled";
      default:
        return "status-default";
    }
  };

  const handleOpenCancelModal = () => {
    setCancelReason("");
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) return;

    setIsCancelling(true);
    const token = localStorage.getItem("user_token");

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.ORDERS}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        "Accept-Language": lang,
      },
      body: JSON.stringify({
        comment: cancelReason,
      }),
    })
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
          setOrderData((prev) => ({ ...prev, status: "CANCELED" }));
          setShowCancelModal(false);
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

  if (isLoading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
    if (error)
    return (
      <div className="text-center py-5">
        <div className="text-danger mb-3"><i className="fas fa-exclamation-triangle fa-3x"></i></div>
        <h4 className="text-main-theme fw-bold">Oops! Something went wrong</h4>
        <p className="text-muted">{error}</p>
        <Button variant="outline-primary" onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );

  if (!orderData)
    return <div className="text-center py-5 text-muted">Order not found.</div>;

  return (
    <div className="py-5 order-details-wrapper">
      <Container className="order-details-container">
        <button
          className="details-back-btn mb-4"
          onClick={() => navigate(-1)}
          data-aos="fade-right"
        >
          {lang === "ar" ? (
            <FaArrowRight className="details-back-icon" />
          ) : (
            <FaArrowLeft className="details-back-icon" />
          )}
          <span>Back to Orders</span>
        </button>

        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3"
          data-aos="fade-down"
        >
          <div>
            <h4 className="fw-bold text-main-theme mb-2">Order Details</h4>
            <div className="d-flex align-items-center gap-3">
              <p className="text-muted m-0">Order #{orderData.id}</p>
              <span
                className={`badge px-3 py-2 rounded-pill fw-medium ${getStatusStyle(orderData.status)}`}
              >
                {orderData.status}
              </span>
            </div>
          </div>

          <div>
            {orderData.status === "PENDING" && (
              <Button
                variant="outline-danger"
                className="d-flex justify-content-center align-items-center p-2 cancel-order-btn-details"
                onClick={handleOpenCancelModal}
                title="Cancel Order"
              >
                <FiTrash2 size={20} />
              </Button>
            )}
          </div>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            <Card
              className="details-card shadow-sm mb-4 border-0"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <Card.Header className="bg-transparent border-bottom p-4">
                <div className="d-flex align-items-center gap-2">
                  <FiPackage className="text-accent" />
                  <h6 className="fw-bold text-main-theme m-0">
                    Package Information
                  </h6>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                {orderData.orderProducts &&
                orderData.orderProducts.length > 0 ? (
                  orderData.orderProducts.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center gap-3 mb-3 border-bottom pb-3 last-child-no-border"
                    >
                      <img
                        src={item.product?.image}
                        alt={item.product_name}
                        className="product-thumb rounded"
                      />
                      <div>
                        <p className="fw-medium text-main-theme mb-1">
                          {item.product_name}
                        </p>
                        <p className="text-muted small mb-0">
                          Qty: {item.quantity}
                        </p>
                        <p className="fw-bold text-main-theme mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted text-center">No items listed.</p>
                )}
              </Card.Body>
            </Card>

            <Card
              className="details-card shadow-sm border-0"
              data-aos="fade-up"
              data-aos-delay="250"
            >
              <Card.Body className="p-4">
                <Row>
                  <Col sm={6} className="mb-3 mb-sm-0">
                    <p className="text-muted mb-1">Subtotal</p>
                    <p className="text-muted mb-1">Shipping</p>
                    <p className="text-muted mb-1">Discount</p>
                    <h6 className="fw-bold text-main-theme mt-3">Total</h6>
                  </Col>
                  <Col sm={6} className="text-sm-end">
                    <p className="text-main-theme fw-medium mb-1">
                      {formatPrice(orderData.subtotal)}
                    </p>
                    <p className="text-main-theme fw-medium mb-1">
                      {formatPrice(orderData.shipping)}
                    </p>
                    <p className="text-danger fw-medium mb-1">
                      -{formatPrice(orderData.discount)}
                    </p>
                    <h6 className="fw-bold text-accent mt-3">
                      {formatPrice(orderData.grand_total)}
                    </h6>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card
              className="details-card shadow-sm border-0"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <Card.Body className="p-4">
                <div className="mb-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FiMapPin className="text-accent" />
                    <h6 className="fw-bold text-main-theme m-0">
                      Shipping Address
                    </h6>
                  </div>
                  <p className="text-muted small m-0 ps-4">
                    {orderData.address 
                      ? (typeof orderData.address === 'object' 
                          ? `${orderData.address.city || ''}, ${orderData.address.neighborhood || ''}, ${orderData.address.street || ''}, Bldg: ${orderData.address.building || ''}`
                          : orderData.address)
                      : "Address details not provided"}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FiCreditCard className="text-accent" />
                    <h6 className="fw-bold text-main-theme m-0">
                      Payment Info
                    </h6>
                  </div>
                  <p className="text-muted small m-0 ps-4">
                    Method: {orderData.payment_type}
                  </p>
                  <p className="text-muted small m-0 ps-4">
                    Status: {orderData.payment_status}
                  </p>
                </div>

                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FiTruck className="text-accent" />
                    <h6 className="fw-bold text-main-theme m-0">
                      Delivery Partner
                    </h6>
                  </div>
                  <p className="text-muted small m-0 ps-4">FastTrack Courier</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Modal
          show={showCancelModal}
          onHide={() => !isCancelling && setShowCancelModal(false)}
          centered
          className="custom-cancel-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              Cancel Order <span className="cancel-order-id">#{orderData.id}</span>
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

export default OrderDetailsPage;
