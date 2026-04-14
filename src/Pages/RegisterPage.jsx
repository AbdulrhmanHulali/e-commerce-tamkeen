import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiCamera,
} from "react-icons/fi";

import { api_config } from "../Config/api";
import "../styles/register.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    image: null,
    agreeTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
    if (error) setError(null);
  };

  const isPhoneValid = /^\d{10}$/.test(formData.phone.trim());

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());

  const isFormValid =
    formData.name.trim() !== "" &&
    isPhoneValid &&
    isEmailValid &&
    formData.agreeTerms;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);

    const apiPayload = new FormData();
    apiPayload.append("name", formData.name);
    apiPayload.append("phone", formData.phone);
    apiPayload.append("email", formData.email);

    if (formData.image) {
      apiPayload.append("image", formData.image);
    }

    console.log("Sending Register Data to API...");

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.REGISTER}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Language": "en",
      },
      body: apiPayload,
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((serverError) => {
            let errorMessage = "Something went wrong!";
            if (serverError.errors) {
              const firstErrorKey = Object.keys(serverError.errors)[0];
              errorMessage = serverError.errors[firstErrorKey][0];
            } else if (serverError.message) {
              errorMessage = serverError.message;
            }
            throw new Error(errorMessage);
          });
        }
      })
      .then(() => {
        console.log("Register Success");
        navigate("/verify", { state: { phone: formData.phone } });
      })
      .catch((err) => {
        console.error("Register Error:", err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="split-auth-wrapper">
      <Row className="g-0 min-vh-100">
        <Col
          lg={6}
          className="d-flex auth-text-side align-items-center justify-content-center p-5"
        >
          <div className="text-content-wrapper w-100 auth-max-w-450">
            <h1 className="fw-bold auth-text-white mb-3 display-5">
              Unlock Exclusive Benefits!
            </h1>
            <p className="auth-text-opacity fs-5 mb-5">
              Create an account today and enjoy a seamless shopping experience
              tailored just for you.
            </p>

            <div className="benefits-list">
              <div className="benefit-item mb-4 d-flex align-items-center gap-3">
                <div className="benefit-icon-box">
                  <FiShoppingBag className="icon-pink" size={24} />
                </div>
                <div>
                  <h5 className="fw-bold auth-text-white m-0">
                    Premium Products
                  </h5>
                  <p className="auth-text-opacity small m-0">
                    Access to top-tier brands and quality items.
                  </p>
                </div>
              </div>

              <div className="benefit-item mb-4 d-flex align-items-center gap-3">
                <div className="benefit-icon-box">
                  <FiTruck className="icon-pink" size={24} />
                </div>
                <div>
                  <h5 className="fw-bold auth-text-white m-0">Fast Delivery</h5>
                  <p className="auth-text-opacity small m-0">
                    Get your orders delivered swiftly and safely.
                  </p>
                </div>
              </div>

              <div className="benefit-item d-flex align-items-center gap-3">
                <div className="benefit-icon-box">
                  <FiShield className="icon-pink" size={24} />
                </div>
                <div>
                  <h5 className="fw-bold auth-text-white m-0">
                    Secure Payments
                  </h5>
                  <p className="auth-text-opacity small m-0">
                    Multiple safe payment options for your peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col lg={6} className="auth-form-side">
          <Container className="auth-form-container d-flex flex-column justify-content-center min-vh-100">
            <div className="w-100 mx-auto auth-register-form-inner">
              <h2 className="fw-bold auth-main-title mb-1">
                Create an account
              </h2>
              <p className="auth-muted-text small mb-4">
                Please enter your details to get started.
              </p>

              {error && (
                <Alert variant="danger" className="py-2 small">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="auth-form">
                <div className="text-center mb-4">
                  <label
                    htmlFor="imageUpload"
                    className="avatar-upload-wrapper"
                  >
                    <div className="avatar-preview">
                      {formData.image ? (
                        <img
                          src={URL.createObjectURL(formData.image)}
                          alt="Profile Preview"
                        />
                      ) : (
                        <FiUser size={40} className="text-muted" />
                      )}
                    </div>
                    <div className="avatar-edit-badge">
                      <FiCamera size={14} />
                    </div>
                  </label>
                  <Form.Control
                    id="imageUpload"
                    type="file"
                    name="image"
                    accept="image/*"
                    className="d-none"
                    onChange={handleInputChange}
                  />
                  <p className="text-muted small mt-2 m-0">
                    Profile Picture (Optional)
                  </p>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium small mb-1">
                    Full Name
                  </Form.Label>
                  <div className="auth-input-wrapper">
                    <FiUser className="auth-input-icon" />
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Samir Mohammad"
                      className="auth-input shadow-none"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </Form.Group>

                <Row className="g-3 mb-3">
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label className="fw-medium small mb-1">
                        Phone Number
                      </Form.Label>
                      <div className="auth-input-wrapper">
                        <FiPhone className="auth-input-icon" />
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="0950000090"
                          className="auth-input shadow-none"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      {formData.phone.length > 0 && !isPhoneValid && (
                        <small
                          className="text-danger mt-1 d-block"
                          style={{ fontSize: "11px" }}
                        >
                          Must be 10 numbers only, letters aren't allowed
                        </small>
                      )}
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group>
                      <Form.Label className="fw-medium small mb-1">
                        Email Address
                      </Form.Label>
                      <div className="auth-input-wrapper">
                        <FiMail className="auth-input-icon" />
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="sm22@example.com"
                          className="auth-input shadow-none"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      {formData.email.length > 0 && !isEmailValid && (
                        <small
                          className="text-danger mt-1 d-block"
                          style={{ fontSize: "11px" }}
                        >
                          Invalid email format
                        </small>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id="termsCheckbox"
                    name="agreeTerms"
                    label={
                      <span className="auth-muted-text small">
                        I agree to the{" "}
                        <Link to="/terms" className="auth-link">
                          Terms & Conditions
                        </Link>
                      </span>
                    }
                    className="custom-checkbox d-flex align-items-center gap-2"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                  />
                  <small className="terms-helper-text">
                    * You must accept our terms to continue
                  </small>
                </Form.Group>
                <Button
                  type="submit"
                  className="auth-submit-btn w-100 fw-bold mb-4 shadow-none"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>

                <p className="text-center auth-muted-text m-0 small">
                  Already have an account?{" "}
                  <Link to="/login" className="auth-link fw-bold">
                    Log in
                  </Link>
                </p>
              </Form>
            </div>
          </Container>
        </Col>
      </Row>
    </div>
  );
}
