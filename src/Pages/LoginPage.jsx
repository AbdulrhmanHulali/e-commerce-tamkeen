import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { FiLock, FiPhone, FiStar, FiHeart, FiSmile } from "react-icons/fi";
import { api_config } from "../Config/api";

import "../styles/register.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phone: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (error) setError(null);
  };

  const isPhoneValid = /^\d{10}$/.test(formData.phone.trim());

  const isFormValid = isPhoneValid ;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);

    const apiPayload = {
      phone: formData.phone,
    };

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Language": "en",
      },
      body: JSON.stringify(apiPayload),
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
        navigate("/verify", { state: { phone: formData.phone } });
      })
      .catch((err) => {
        console.error("Login Error:", err);
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
          className="d-flex auth-text-side align-items-center justify-content-center p-4 p-lg-5"
        >
          <div className="text-content-wrapper w-100 auth-max-w-450">
            <h1 className="fw-bold auth-text-white mb-3 display-5">
              Welcome Back!
            </h1>
            <p className="auth-text-opacity fs-5 mb-5">
              We're so happy to see you again. Log in to continue your amazing
              shopping journey.
            </p>

            <div className="benefits-list">
              <div className="benefit-item mb-4 d-flex align-items-center gap-3">
                <div className="benefit-icon-box">
                  <FiHeart className="icon-pink" size={24} />
                </div>
                <div>
                  <h5 className="fw-bold auth-text-white m-0">
                    Your Favorites
                  </h5>
                  <p className="auth-text-opacity small m-0">
                    Access your saved items and wishlists instantly.
                  </p>
                </div>
              </div>

              <div className="benefit-item mb-4 d-flex align-items-center gap-3">
                <div className="benefit-icon-box">
                  <FiStar className="icon-pink" size={24} />
                </div>
                <div>
                  <h5 className="fw-bold auth-text-white m-0">
                    Exclusive Offers
                  </h5>
                  <p className="auth-text-opacity small m-0">
                    Check out the latest deals picked just for you.
                  </p>
                </div>
              </div>

              <div className="benefit-item d-flex align-items-center gap-3">
                <div className="benefit-icon-box">
                  <FiSmile className="icon-pink" size={24} />
                </div>
                <div>
                  <h5 className="fw-bold auth-text-white m-0">Fast Checkout</h5>
                  <p className="auth-text-opacity small m-0">
                    Enjoy a quicker and easier checkout process.
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
                Log in to your account
              </h2>
              <p className="auth-muted-text small mb-4">
                Please enter your phone number.
              </p>
              {error && (
                <Alert variant="danger" className="py-2 small">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} className="auth-form">
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium small mb-1">
                    Phone Number
                  </Form.Label>
                  <div className="auth-input-wrapper">
                    <FiPhone className="auth-input-icon" />
                    <Form.Control
                      type="tel"
                      name="phone"
                      placeholder="e.g. 0950000090"
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
                      Must be exactly 10 digits
                    </small>
                  )}
                </Form.Group>                  
                <Button
                  type="submit"
                  className="auth-submit-btn w-100 fw-bold mb-4 shadow-none"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
                <p className="text-center auth-muted-text m-0 small">
                  Don't have an account?{" "}
                  <Link to="/register" className="auth-link fw-bold">
                    Register Now
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
