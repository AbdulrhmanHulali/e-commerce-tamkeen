import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Modal,
  Alert,
} from "react-bootstrap";
import { Link, useLocation } from "react-router";
import { AppContext } from "../Contexts/AppContext";
import { api_config } from "../Config/api";
import { FiCreditCard, FiCheckCircle, FiPackage } from "react-icons/fi";

import AOS from "aos";
import "aos/dist/aos.css";
import "../styles/checkoutPage.css";

import syriatelLogo from "../assets/images/syriatel.png";
import mtnLogo from "../assets/images/mtn.png";
import successIcon from "../assets/images/successIcon.svg";

import AddressSection from "../Components/Checkout/AddressSection";
import OrderSummary from "../Components/Checkout/OrderSummary";
import AddressModals from "../Components/Checkout/AddressModals";

const initialAddressState = {
  name: "",
  phone: "",
  city: "",
  neighborhood: "",
  street: "",
  building: "",
  zip_code: "",
  is_default: false,
  lat: "3.12312",
  lng: "4.12312",
};

export default function CheckoutPage() {
  const location = useLocation();

  const { cartItems, clearCart, formatPrice, lang } =
    useContext(AppContext);
  const checkoutItems = location.state?.selectedItemsForCheckout || cartItems;

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState(initialAddressState);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [statusMessage, setStatusMessage] = useState(null);

  const fetchAddresses = () => {
    const token = localStorage.getItem("user_token");
    setIsLoadingAddresses(true);
    setStatusMessage(null);

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.GET_ADDRESS}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": lang || "en",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch addresses");
        return res.json();
      })
      .then((result) => {
        if (result.code === 1) {
          setAddresses(result.data);
          const defaultAddress = result.data.find(
            (addr) => addr.is_default === 1,
          );
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          } else if (result.data.length > 0) {
            setSelectedAddressId(result.data[0].id);
          }
        } else {
          throw new Error(result.message || "Error fetching addresses");
        }
      })
      .catch((err) => {
        console.error("Error fetching addresses:", err);
        setStatusMessage({ type: "danger", text: err.message });
      })
      .finally(() => setIsLoadingAddresses(false));
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 50 });
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = () => {
    setNewAddress(initialAddressState);
    setShowAddModal(true);
  };

  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    setIsAddingAddress(true);
    setStatusMessage(null);
    const token = localStorage.getItem("user_token");

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.ADD_ADDRESS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newAddress),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add address");
        return res.json();
      })
      .then((result) => {
        if (result.code === 1) {
          setAddresses((prev) => [...prev, result.data]);
          setSelectedAddressId(result.data.id);
          if (result.data.is_default) fetchAddresses();
          setShowAddModal(false);
        } else {
          throw new Error(result.message || "Error adding address");
        }
      })
      .catch((err) => {
        console.error("Error adding address:", err);
        setStatusMessage({ type: "danger", text: err.message });
      })
      .finally(() => setIsAddingAddress(false));
  };

  const openEditModal = (e, address) => {
    e.stopPropagation();
    setEditingAddress({
      ...address,
      is_default: address.is_default === 1 || address.is_default === true,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateAddress = (e) => {
    e.preventDefault();
    setIsSavingAddress(true);
    const token = localStorage.getItem("user_token");

    const payload = {
      ...editingAddress,
      lat: editingAddress.lat || "3.12312",
      lng: editingAddress.lng || "4.12312",
    };

    fetch(
      `${api_config.BASE_URL}${api_config.ENDPOINTS.EDIT_ADDRESS}${editingAddress.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Language": lang,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update address");
        return res.json();
      })
      .then((result) => {
        if (result.code === 1) {
          setAddresses((prev) =>
            prev.map((addr) =>
              addr.id === result.data.id ? result.data : addr,
            ),
          );
          if (result.data.is_default) fetchAddresses();
          setShowEditModal(false);
        }
      })
      .catch((err) => console.error("Error updating address:", err))
      .finally(() => setIsSavingAddress(false));
  };

  const handleDeleteAddress = (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    setStatusMessage(null);
    const token = localStorage.getItem("user_token");
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.DELETE_ADDRESS}${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Accept-Language": lang || "en",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete address");
        return res.json();
      })
      .then((result) => {
        if (result.code === 1) {
          const remainingAddresses = addresses.filter((addr) => addr.id !== id);
          setAddresses(remainingAddresses);

          if (selectedAddressId === id) {
            if (remainingAddresses.length > 0) {
              const defaultAddress = remainingAddresses.find(
                (addr) => addr.is_default === 1,
              );
              setSelectedAddressId(
                defaultAddress ? defaultAddress.id : remainingAddresses[0].id,
              );
            } else {
              setSelectedAddressId(null);
            }
          }
        } else {
          throw new Error(result.message || "Could not delete address.");
        }
      })
      .catch((err) => {
        console.error("Error deleting address:", err);
        setStatusMessage({ type: "danger", text: err.message });
      });
  };

  const subtotal = checkoutItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = checkoutItems.length > 0 ? 4.0 : 0;
  const netTotal = checkoutItems.length > 0 ? subtotal + tax : 0;
  const isFormValid =
    selectedAddressId !== null &&
    paymentMethod !== null &&
    checkoutItems.length > 0;

  const handleConfirmPayment = () => {
    if (!isFormValid) return;

    setIsPlacingOrder(true);
    setStatusMessage(null);
    const token = localStorage.getItem("user_token");
    const payload = {
      note: orderNotes || "",
      payment_type: paymentMethod.toUpperCase(),
      address_id: selectedAddressId,
      ...(couponCode.trim() && { coupon_code: couponCode.trim() }),
    };

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.PLACE_ORDER}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Accept-Language": lang || "en",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to place order");
        return res.json();
      })
      .then((result) => {
        if (result.code === 1) {
          console.log("Order Placed Successfully:", result.data);
          clearCart();
          setShowSuccessModal(true);
        } else {
          setStatusMessage({
            type: "danger",
            text: result.message || "Something went wrong!",
          });
        }
      })
      .catch((err) => {
        console.error("Error placing order:", err);
        setStatusMessage({
          type: "danger",
          text: "Failed to connect to the server. Please check your internet.",
        });
      })
      .finally(() => {
        setIsPlacingOrder(false);
      });
  };

  return (
    <div className="checkout-page-wrapper py-5">
      <Container>
        <h2 className="checkout-main-title fw-bold mb-4" data-aos="fade-down">
          Checkout
        </h2>
        {statusMessage && (
          <Alert
            variant={statusMessage.type}
            dismissible
            onClose={() => setStatusMessage(null)}
            className="mb-4 border-0 shadow-sm"
          >
            {statusMessage.text}
          </Alert>
        )}
        <Row className="g-4">
          <Col lg={8} data-aos="fade-right" data-aos-delay="100">
            <AddressSection
              isLoadingAddresses={isLoadingAddresses}
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
              openAddModal={openAddModal}
              openEditModal={openEditModal}
              handleDeleteAddress={handleDeleteAddress}
            />

            <div className="checkout-card mb-4">
              <h5 className="checkout-section-title d-flex align-items-center gap-2 mb-3">
                <FiPackage className="text-pink" /> Order Notes
              </h5>
              <Form>
                <Form.Group>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="custom-checkout-input shadow-none checkout-notes-input"
                    placeholder="Add any special instructions for delivery (Optional)..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </div>

            <div className="checkout-card">
              <h5 className="checkout-section-title d-flex align-items-center gap-2">
                <FiCreditCard className="text-pink" /> Payment Method
              </h5>
              <Row className="g-3 mt-1">
                <Col md={4}>
                  <div
                    className={`payment-method-card ${paymentMethod === "cash" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    <div className="d-flex flex-column align-items-center justify-content-center text-center h-100 gap-2">
                      <FiCheckCircle className="check-icon" />
                      <span className="fw-bold text-main-theme">
                        Cash on Delivery
                      </span>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div
                    className={`payment-method-card ${paymentMethod === "syriatel" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("syriatel")}
                  >
                    <div className="d-flex flex-column align-items-center justify-content-center text-center h-100 gap-2">
                      <FiCheckCircle className="check-icon" />
                      <img src={syriatelLogo} alt="Syriatel Cash" height="30" />
                      <span className="fw-bold text-main-theme small">
                        Syriatel Cash
                      </span>
                    </div>
                  </div>
                </Col>
                <Col md={4}>
                  <div
                    className={`payment-method-card ${paymentMethod === "mtn" ? "active" : ""}`}
                    onClick={() => setPaymentMethod("mtn")}
                  >
                    <div className="d-flex flex-column align-items-center justify-content-center text-center h-100 gap-2">
                      <FiCheckCircle className="check-icon" />
                      <img src={mtnLogo} alt="MTN Cash" height="30" />
                      <span className="fw-bold text-main-theme small">
                        MTN Cash
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          <Col lg={4} data-aos="fade-left" data-aos-delay="200">
            <OrderSummary
              checkoutItems={checkoutItems}
              formatPrice={formatPrice}
              subtotal={subtotal}
              tax={tax}
              netTotal={netTotal}
              isFormValid={isFormValid}
              handleConfirmPayment={handleConfirmPayment}
              isPlacingOrder={isPlacingOrder}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
            />
          </Col>
        </Row>
      </Container>

      <AddressModals
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newAddress={newAddress}
        handleAddChange={handleAddChange}
        handleAddAddress={handleAddAddress}
        isAddingAddress={isAddingAddress}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        editingAddress={editingAddress}
        handleEditChange={handleEditChange}
        handleUpdateAddress={handleUpdateAddress}
        isSavingAddress={isSavingAddress}
      />

      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        centered
        backdrop="static"
        dialogClassName="custom-success-modal"
      >
        <Modal.Header
          closeButton
          className="custom-modal-header border-0"
        ></Modal.Header>
        <div className="icon-wrapper text-center">
          <img
            src={successIcon}
            alt="Success"
            className="success-icon-img custom-success-icon"
          />
        </div>
        <Modal.Body className="custom-modal-body text-center pb-4 px-4">
          <h4 className="fw-bold mb-2 text-main-theme mt-2">
            Order Confirmed!
          </h4>
          <p className="text-muted-theme mb-4">
            Your order has been placed successfully and is being processed.
          </p>
          <Button
            as={Link}
            to="/orders"
            className="confirm-order-btn w-100 shadow-none fw-bold"
            onClick={() => setShowSuccessModal(false)}
          >
            Track My Order
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}
