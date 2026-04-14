import { Container, Button } from "react-bootstrap";
import { useState, useEffect, useContext } from "react"; 
import {
  FiShield,
  FiFileText,
  FiUserCheck,
  FiLock,
  FiInfo,
  FiMail,
  FiHelpCircle,
} from "react-icons/fi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { AppContext } from "../Contexts/AppContext";
import { useNavigate } from "react-router";
import { api_config } from "../Config/api"; 
import mockData from "../../public/data/mockdata.json";
import "../styles/terms.css";

const icons = [
  <FiShield />,
  <FiFileText />,
  <FiUserCheck />,
  <FiLock />,
  <FiInfo />,
  <FiHelpCircle />,
];

const TermsPage = () => {
  const navigate = useNavigate();
  const { lang } = useContext(AppContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [apiTermsData, setApiTermsData] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rawData = mockData.termsData || [];
  const termsData = rawData.length % 2 === 0 ? rawData : rawData.slice(0, -1);
  const { header, footer } = mockData.termsPageData;

  useEffect(() => {
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.TERMS_CONDITIONS}`, {
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
          setApiTermsData(result.data);
        }
      })
      .catch((err) => console.log("Terms fetch info:", err.message)); 
  }, [lang]);

  return (
    <div className="terms-page-wrapper">
      <Container>
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
        <header className="terms-header-section">
          <h1 className="terms-hero-title">
            {header.titlePart1} <span className="highlight">{header.titleHighlight}</span>
          </h1>
          <p className="terms-update-text">{header.updateText}</p>
        </header>

        <div className="terms-grid mb-5">
          {termsData.map((item, index) => (
            <div className="term-card" key={index}>
              <div className="term-icon-box">{icons[index % icons.length]}</div>
              <div className="term-content-wrap">
                <h3 className="term-title">{item.title}</h3>
                <p className="term-desc">{item.content}</p>
              </div>
            </div>
          ))}
        </div>

        {apiTermsData && (
          <div className="api-terms-section p-4 p-md-5 shadow-sm">
            {apiTermsData.image && (
              <div className="api-terms-img-wrapper mb-4">
                <img
                  src={apiTermsData.image}
                  alt="Terms and Conditions Content"
                  className="api-terms-img"
                />
              </div>
            )}
            {apiTermsData.value && (
              <div className="api-terms-content text-muted-theme">
                {apiTermsData.value}
              </div>
            )}
          </div>
        )}

        <div className="terms-footer-pink-card shadow-lg">
          <h2 className="display-6 fw-bold">{footer.title}</h2>
          <p className="lead">
            {footer.lead}
          </p>
          <Button
            className="terms-contact-btn"
            onClick={() => navigate("/contact-us")}
          >
            <FiMail className="me-2" />
            {footer.btnText}
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default TermsPage;