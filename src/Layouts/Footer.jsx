import { useContext } from "react";
import { Container, Row, Col, Nav, Button, Dropdown } from "react-bootstrap";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";
import { AppContext } from "../Contexts/AppContext";
import { Link } from "react-router"; // تم تصحيح الاستيراد ليكون react-router-dom إذا لزم الأمر أو تركه كما هو في مشروعك
import logo from "../assets/images/logo.svg";
import "./footer.css";

export default function Footer() {
  const { lang, setLang } = useContext(AppContext);

  return (
    <footer className="main-footer pt-5 mt-auto border-top">
      <Container>
        <Row className="gy-4 mb-5">
          <Col lg={4} md={12} className="text-center text-md-start">
            <div className="footer-brand mb-3 d-flex justify-content-center justify-content-md-start">
              <Link to="/">
                <img src={logo} alt="Brand Logo" className="footer-logo" />
              </Link>
            </div>

            <p className="footer-desc mb-4 mx-auto mx-md-0">
              Best information about the company goes here but now lorem ipsum
              is
            </p>
            <div className="social-icons d-flex justify-content-center justify-content-md-start gap-2">
              <a
                href="https://facebook.com"
                className="social-icon-wrapper text-decoration-none"
              >
                <FaFacebook />
              </a>
              <a
                href="https://twitter.com"
                className="social-icon-wrapper text-decoration-none"
              >
                <FaTwitter />
              </a>
              <a
                href="https://linkedin.com"
                className="social-icon-wrapper text-decoration-none"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://instagram.com"
                className="social-icon-wrapper text-decoration-none"
              >
                <FaInstagram />
              </a>
              <a
                href="https://youtube.com"
                className="social-icon-wrapper text-decoration-none"
              >
                <FaYoutube />
              </a>
            </div>
          </Col>
          <Col lg={8} md={12}>
            <Row className="gy-4">
              <Col
                xs={12}
                sm={6}
                md={3}
                lg={2}
                className="text-center text-md-start"
              >
                <h6 className="footer-title fw-bold mb-3">About</h6>
                <Nav className="flex-column align-items-center align-items-md-start gap-2">
                  <Nav.Link as={Link} to="/about" className="p-0 footer-link">
                    About Us
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/all-categories"
                    className="p-0 footer-link"
                  >
                    Categories
                  </Nav.Link>
                  <Nav.Link as={Link} to="/faq" className="p-0 footer-link">
                    FAQ
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/contact-us"
                    className="p-0 footer-link"
                  >
                    Contact Us
                  </Nav.Link>
                </Nav>
              </Col>

              <Col
                xs={12}
                sm={6}
                md={3}
                lg={2}
                className="text-center text-md-start"
              >
                <h6 className="footer-title fw-bold mb-3">Quick Links</h6>
                <Nav className="flex-column align-items-center align-items-md-start gap-2">
                  <Nav.Link as={Link} to="/" className="p-0 footer-link">
                    Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/cart" className="p-0 footer-link">
                    Cart
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/checkout"
                    className="p-0 footer-link"
                  >
                    Checkout
                  </Nav.Link>
                  <Nav.Link as={Link} to="/profile" className="p-0 footer-link">
                    Profile
                  </Nav.Link>
                </Nav>
              </Col>

              <Col
                xs={12}
                sm={6}
                md={3}
                lg={3}
                className="text-center text-md-start"
              >
                <h6 className="footer-title fw-bold mb-3">Information</h6>
                <Nav className="flex-column align-items-center align-items-md-start gap-2">
                  <Nav.Link
                    as={Link}
                    to="/contact-us"
                    className="p-0 footer-link"
                  >
                    Help Center
                  </Nav.Link>
                  <Nav.Link as={Link} to="/privacy" className="p-0 footer-link">
                    Privacy Policy
                  </Nav.Link>
                  <Nav.Link as={Link} to="/terms" className="p-0 footer-link">
                    Terms & Conditions
                  </Nav.Link>
                  <Nav.Link as={Link} to="/faq" className="p-0 footer-link">
                    Refund Policy
                  </Nav.Link>
                </Nav>
              </Col>

              <Col
                xs={12}
                sm={6}
                md={3}
                lg={2}
                className="text-center text-md-start"
              >
                <h6 className="footer-title fw-bold mb-3">For users</h6>
                <Nav className="flex-column align-items-center align-items-md-start gap-2">
                  <Nav.Link as={Link} to="/profile" className="p-0 footer-link">
                    My Account
                  </Nav.Link>
                  <Nav.Link as={Link} to="/orders" className="p-0 footer-link">
                    My Orders
                  </Nav.Link>
                  <Nav.Link as={Link} to="/cart" className="p-0 footer-link">
                    Shopping Cart
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/checkout"
                    className="p-0 footer-link"
                  >
                    Checkout
                  </Nav.Link>
                </Nav>
              </Col>
              <Col xs={12} md={12} lg={3} className="text-center text-lg-start">
                <h6 className="footer-title fw-bold mb-3">Get app</h6>
                <div className="d-flex flex-row flex-lg-column justify-content-center justify-content-lg-start gap-2">
                  <Button
                    variant="dark"
                    className="app-btn shadow-sm"
                    onClick={() =>
                      (window.location.href = "https://apps.apple.com/")
                    }
                  >
                    <FaApple size={24} className="mb-1" />
                    <div className="text-start lh-1">
                      <small className="app-btn-small">Download on the</small>
                      <div className="fw-bold">App Store</div>
                    </div>
                  </Button>
                  <Button
                    variant="dark"
                    className="app-btn shadow-sm"
                    onClick={() =>
                      (window.location.href = "https://play.google.com/store/")
                    }
                  >
                    <FaGooglePlay size={20} className="mb-1" />
                    <div className="text-start lh-1">
                      <small className="app-btn-small">GET IT ON</small>
                      <div className="fw-bold">Google Play</div>
                    </div>
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <div className="footer-bottom py-3">
        <Container className="d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start">
          <p className="mb-2 mb-md-0 footer-copyright">
            © 2026 TamStore. All rights reserved.
          </p>

          <Dropdown className="mt-2 mt-md-0">
            <Dropdown.Toggle
              variant="transparent"
              className="footer-lang d-flex align-items-center justify-content-center gap-2 border-0 p-0 shadow-none"
            >
              <img
                src={
                  lang === "en"
                    ? "https://flagcdn.com/us.svg"
                    : "https://flagcdn.com/sa.svg"
                }
                width="20"
                alt={lang === "en" ? "US Flag" : "SA Flag"}
                className="rounded-1"
              />
              <span>{lang === "en" ? "English" : "العربية"}</span>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end" className="shadow-sm border-0 mb-2">
              <Dropdown.Item
                onClick={() => setLang("en")}
                active={lang === "en"}
              >
                <img
                  src="https://flagcdn.com/us.svg"
                  width="16"
                  alt="US"
                  className="me-2 rounded-1"
                />{" "}
                English
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => setLang("ar")}
                active={lang === "ar"}
              >
                <img
                  src="https://flagcdn.com/sa.svg"
                  width="16"
                  alt="SA"
                  className="me-2 rounded-1"
                />{" "}
                العربية
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </div>
    </footer>
  );
}
