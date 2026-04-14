import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeadset,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import "../styles/contactus.css";
import { api_config } from "../Config/api";
import { AppContext } from "../Contexts/AppContext";

export default function ContactUsPage() {
  const navigate = useNavigate();
  const { lang } = useContext(AppContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [contactType, setContactType] = useState("EMAIL");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "", 
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (token) {
      fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.PROFILE}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Accept-Language": lang,
        },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch profile");
        })
        .then((result) => {
          if (result.data && result.data.user) {
            const userData = result.data.user;
            const nameParts = (userData.name || "").split(" ");
            
            setFormData((prev) => ({
              ...prev,
              firstName: prev.firstName || nameParts[0] || "",
              lastName: prev.lastName || nameParts.slice(1).join(" ") || "",
              email: prev.email || userData.email || "",
              phone: prev.phone || userData.phone || "",
            }));
          }
        })
        .catch((err) => console.log("User not logged in or profile fetch failed:", err));
    }
  }, [lang]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const isFormValid =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.message.trim() !== "" &&
    (contactType === "EMAIL"
      ? formData.email.trim() !== ""
      : formData.phone.trim() !== "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("user_token");
    const apiPayload = {
      temp_user_id: null,
      type: contactType,
      message: formData.message,
    };

    if (contactType === "EMAIL") {
      apiPayload.email = formData.email;
    } else {
      apiPayload.phone = formData.phone;
    }
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": lang,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    console.log("Payload:", apiPayload);

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.CONTACT}`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(apiPayload),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((serverError) => {
            throw new Error(serverError.message || "Failed to send message");
          });
        }
        return res.json();
      })
      .then((result) => {
        console.log("Server Response (Contact):", result);
        if (result.code === 1) {
          setStatusMessage({
            type: "success",
            text:  "Success! Your message has been sent.",
          });
          setFormData((prev) => ({ ...prev, message: "" }));
          setTimeout(() => setStatusMessage(null), 4000);
        }
      })
      .catch((err) => {
        console.error("Contact Error:", err);
        setStatusMessage({
          type: "danger",
          text: err.message || "Failed to send message",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="contact-page-wrapper">
      <Container className="py-5 contact-page">
        {!isMobile && (
          <div className="d-flex mb-4">
            <button
              className="back-btn mb-4"
              onClick={() => navigate("/profile")}
            >
              {lang === "ar" ? (
                <FaArrowRight className="back-icon" />
              ) : (
                <FaArrowLeft className="back-icon" />
              )}
              <span>Back to Profile</span>
            </button>
          </div>
        )}

        <div className="mb-5 pb-3">
          <h2 className="fw-bold contact-title mb-3">
           Get in Touch
          </h2>
          <p className="text-muted-theme contact-subtitle">
           We'd love to hear from you. Please fill out this form or shoot us an email.
          </p>
        </div>
        <Row className="g-4 g-lg-5 align-items-center">
          <Col lg={7}>
            <div className="contact-form-wrapper p-4 p-md-5 rounded-4 shadow-sm bg-card-theme border border-secondary border-opacity-10 h-100">
              <h4 className="fw-bold mb-4 text-main-theme">
               Send us a Message
              </h4>
              {statusMessage && (
                <Alert
                  variant={statusMessage.type}
                  dismissible
                  onClose={() => setStatusMessage(null)}
                  className="border-0 shadow-sm"
                >
                  {statusMessage.text}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Row className="g-4 mb-4">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-main-theme fw-medium small mb-2">
                        First Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="custom-input py-2 shadow-none"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-main-theme fw-medium small mb-2">
                       Last Name
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="custom-input py-2 shadow-none"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-4">
                  <Form.Label className="text-main-theme fw-medium small mb-2">
                  Contact Method
                  </Form.Label>
                  <Form.Select
                    value={contactType}
                    onChange={(e) => setContactType(e.target.value)}
                    className="custom-input py-2 shadow-none"
                  >
                    <option value="EMAIL">
                     Email Address
                    </option>
                    <option value="PHONE">
                     Phone Number
                    </option>
                  </Form.Select>
                </Form.Group>

                {contactType === "EMAIL" ? (
                  <Form.Group className="mb-4">
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="custom-input py-2 shadow-none"
                    />
                  </Form.Group>
                ) : (
                  <Form.Group className="mb-4">
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="0992990128"
                      value={formData.phone}
                      onChange={handleChange}
                      className="custom-input py-2 shadow-none text-start"
                      dir="ltr"
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-4">
                  <Form.Label className="text-main-theme fw-medium small mb-2">
                    {lang === "ar" ? "الرسالة" : "Message"}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    rows={5}
                    placeholder={
                      lang === "ar"
                        ? "كيف يمكننا مساعدتك؟"
                        : "How can we help you?"
                    }
                    value={formData.message}
                    onChange={handleChange}
                    className="custom-input shadow-none contact-textarea"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="auth-submit-btn w-100 py-2 fw-bold"
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? (
                    <span>
                      {lang === "ar" ? "جاري الإرسال..." : "Sending..."}{" "}
                      <i className="spinner-border spinner-border-sm ms-2"></i>
                    </span>
                  ) : lang === "ar" ? (
                    "إرسال الرسالة"
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </Form>
            </div>
          </Col>

          <Col lg={5}>
            <Row className="g-4 h-100 align-content-start">
              <Col sm={6}>
                <Card
                  className="info-card border-0 shadow-sm p-3 h-100 clickable-card"
                  onClick={() => window.open("https://www.gmail.com")}
                >
                  <Card.Body className="d-flex flex-column align-items-center text-center gap-3 p-0">
                    <div className="info-icon-box">
                      <FaEnvelope size={22} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-main-theme">Email</h6>
                      <p className="mb-0 text-muted small">
                        support@example.com
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6}>
                <Card
                  className="info-card border-0 shadow-sm p-3 h-100 clickable-card"
                  onClick={() => (window.location.href = "tel:+1234567890")}
                >
                  <Card.Body className="d-flex flex-column align-items-center text-center gap-3 p-0">
                    <div className="info-icon-box">
                      <FaPhone size={22} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-main-theme">Phone</h6>
                      <p className="mb-0 text-muted small">+1 (234) 567-890</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6}>
                <Card
                  className="info-card border-0 shadow-sm p-3 h-100 clickable-card"
                  onClick={() =>
                    window.open(
                      "https://maps.google.com"
                    )
                  }
                >
                  <Card.Body className="d-flex flex-column align-items-center text-center gap-3 p-0">
                    <div className="info-icon-box">
                      <FaMapMarkerAlt size={22} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-main-theme">Visit Us</h6>
                      <p className="mb-0 text-muted small">
                        123 Business St, NY
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col sm={6}>
                <Card className="info-card border-0 shadow-sm p-3 h-100">
                  <Card.Body className="d-flex flex-column align-items-center text-center gap-3 p-0">
                    <div className="info-icon-box">
                      <FaHeadset size={22} />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1 text-main-theme">
                        Live Support
                      </h6>
                      <p className="mb-0 text-muted small">Available 24/7</p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}