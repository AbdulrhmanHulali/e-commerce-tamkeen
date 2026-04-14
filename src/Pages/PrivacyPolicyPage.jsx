import { useState, useEffect, useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight, FaEnvelope } from "react-icons/fa";
import {
  FiLock,
  FiDatabase,
  FiShare2,
  FiUserCheck,
  FiSettings,
  FiFileText,
} from "react-icons/fi";
import { useNavigate } from "react-router";
import { AppContext } from "../Contexts/AppContext";
import { api_config } from "../../Config/API"; 
import "../index.css";
import "../styles/privacypolicy.css";
import mockData from "../../public/data/mockdata.json";

const iconMap = {
  FiDatabase: <FiDatabase />,
  FiUserCheck: <FiUserCheck />,
  FiShare2: <FiShare2 />,
  FiLock: <FiLock />,
  FiSettings: <FiSettings />,
  FiFileText: <FiFileText />,
};

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();
  const { lang } = useContext(AppContext);
  const privacyData = mockData.privacyData || [];
  const { header, footer } = mockData.privacyPageData;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [apiPrivacyData, setApiPrivacyData] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.PRIVACY_POLICY}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Accept-Language": lang,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("API not ready yet or 404 Not Found");
        return res.json();
      })
      .then((result) => {
        if (result.code === 1 && result.data) {
          setApiPrivacyData(result.data);
        }
      })
      .catch((err) => console.log("Privacy policy fetch info:", err.message)); 
  }, [lang]);

  return (
    <div className="privacy-page-wrapper py-5">
      <Container className="privacy-main-container">
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

        <div className="privacy-header mb-5">
          <span className="privacy-badge mb-3">{header.badge}</span>
          <h2 className="display-5 fw-bold text-main-theme mb-4">
            {header.title}
          </h2>
          <p className="privacy-subtitle text-muted-theme">{header.subtitle}</p>
        </div>

        <Row className="g-4 mb-5">
          {privacyData.map((item, index) => (
            <Col md={6} key={index}>
              <div className="privacy-section-card h-100 p-4 p-md-5 shadow-sm ">
                <div className="privacy-icon-box mb-4">
                  {iconMap[item.icon] || <FiLock />}
                </div>
                <h4 className="fw-bold text-main-theme mb-3">{item.title}</h4>
                <p className="text-muted-theme mb-0 privacy-desc">
                  {item.content}
                </p>
              </div>
            </Col>
          ))}
        </Row>

        {apiPrivacyData && (
          <div className="api-privacy-section p-4 p-md-5 shadow-sm mb-5">
            {apiPrivacyData.image && (
              <div className="api-privacy-img-wrapper mb-4">
                <img
                  src={apiPrivacyData.image}
                  alt="Privacy Policy Content"
                  className="api-privacy-img"
                />
              </div>
            )}
            {apiPrivacyData.value && (
              <div className="api-privacy-content text-muted-theme">
                {apiPrivacyData.value}
              </div>
            )}
          </div>
        )}

        <div className="privacy-footer-card mt-5 p-4 p-md-5 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 shadow-sm">
          <div className="d-flex align-items-center gap-3">
            <div className="privacy-footer-icon-wrap flex-shrink-0">
              <FaEnvelope />
            </div>
            <div>
              <h4 className="fw-bold text-main-theme mb-1">{footer.title}</h4>
              <p className="text-muted-theme m-0">{footer.text}</p>
            </div>
          </div>
          <button
            className="btn privacy-contact-btn px-4 py-3 fw-bold flex-shrink-0"
            onClick={() => navigate("/contact-us")}
          >
            {footer.btnText}
          </button>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicyPage;
