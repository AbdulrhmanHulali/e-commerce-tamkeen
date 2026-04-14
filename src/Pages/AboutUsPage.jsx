import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  FaShieldAlt,
  FaShippingFast,
  FaSmile,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { AppContext } from "../Contexts/AppContext";
import mockData from "../../public/data/mockdata.json";

import AOS from "aos";
import "aos/dist/aos.css";

import "../styles/aboutus.css";

const iconMap = {
  FaShieldAlt: <FaShieldAlt size={28} />,
  FaShippingFast: <FaShippingFast size={28} />,
  FaSmile: <FaSmile size={28} />,
};

export default function AboutUsPage() {
  const navigate = useNavigate();
  const { lang } = useContext(AppContext);

  const { hero, stats, valuesHeader, values } = mockData.aboutUsPageData;
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="about-page">
    <Container className="py-5">
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

      <Row className="align-items-center mb-5 pb-4 border-bottom border-secondary border-opacity-25">
        <Col lg={6} className="mb-4 mb-lg-0" data-aos="fade-right">
          <h2 className="fw-bold contact-title mb-4">{hero.title}</h2>
          <h4 className="fw-bold text-main-theme mb-3">{hero.subtitle}</h4>
          <p className="text-main-theme line-height-lg">{hero.description}</p>
        </Col>

        <Col lg={6} data-aos="fade-left">
          <div className="about-image-wrapper rounded-4 overflow-hidden shadow-sm">
            <img
              src={hero.image}
              alt="Our Team"
              className="img-fluid about-hero-img"
            />
          </div>
        </Col>
      </Row>

      <Row className="text-center mb-5 pb-4 g-4 border-bottom border-secondary border-opacity-25">
        {stats.map((stat) => (
          <Col
            md={4}
            key={stat.id}
            data-aos="fade-up"
            data-aos-delay={stat.delay}
          >
            <div className="stat-box p-4 rounded-4">
              <h2 className="fw-bold text-accent mb-2">{stat.value}</h2>
              <p className="text-main-theme fw-medium mb-0">{stat.label}</p>
            </div>
          </Col>
        ))}
      </Row>

      <div className="text-center mb-5" data-aos="zoom-in">
        <h3 className="fw-bold text-main-theme mb-3">{valuesHeader.title}</h3>
        <p className="text-main-theme mx-auto">{valuesHeader.subtitle}</p>
      </div>

      <Row className="g-4">
        {values.map((val) => (
          <Col
            md={4}
            key={val.id}
            data-aos="zoom-in"
            data-aos-delay={val.delay}
          >
            <Card className="value-card border-0 shadow-sm h-100 p-4 text-center">
              <div className="value-icon-box mx-auto mb-4">
                {iconMap[val.icon]}
              </div>
              <h5 className="fw-bold text-main-theme mb-3">{val.title}</h5>
              <p className="text-main-theme small mb-0">{val.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
    </div>
  );
}
