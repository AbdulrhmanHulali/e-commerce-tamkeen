import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router";
import { AppContext } from "../Contexts/AppContext";
import mockData from "../../public/data/mockdata.json";
import "../index.css";
import "../styles/faq.css";

const FaqPage = () => {
  const navigate = useNavigate();
  const { lang } = useContext(AppContext);

  const faqData = mockData.faqData;
  const { sidebar } = mockData.faqPageData;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="faq-page-wrapper py-5">
      <Container className="faq-main-container">
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


        <Row className="g-4 g-lg-5">
          <Col lg={5} className="mb-4 mb-lg-0">
            <div className="faq-sidebar-sticky text-start">
              <h2 className="faq-title display-5 fw-bold mb-4 mt-2">
                {sidebar.titlePart1}{" "}
                <span className="text-pink">{sidebar.titleHighlight}</span>{" "}
                {sidebar.titlePart2}
              </h2>

              <p className="faq-subtitle text-muted-theme mb-5">
                {sidebar.subtitle}
              </p>

              <div className="faq-contact-card p-4 p-md-5 text-start">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="faq-contact-icon-wrap flex-shrink-0">
                    <FaEnvelope />
                  </div>
                  <div>
                    <h5 className="fw-bold text-main-theme mb-2">
                      {sidebar.contactTitle}
                    </h5>
                    <span className="faq-contact-status">
                      {sidebar.contactStatus}
                    </span>
                  </div>
                </div>

                <p className="text-muted-theme mb-4 faq-contact-desc">
                  {sidebar.contactDesc}
                </p>

                <button
                  className="btn faq-contact-btn w-100 py-3 fw-bold shadow-none d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate("/contact-us")}
                >
                  <FaEnvelope /> {sidebar.contactBtn}
                </button>
              </div>
            </div>
          </Col>

          <Col lg={7}>
            <Accordion defaultActiveKey="0" className="custom-pink-accordion">
              {faqData.map((faq, index) => (
                <Accordion.Item
                  eventKey={index.toString()}
                  key={index}
                  className="faq-item-card"
                >
                  <Accordion.Header className="faq-item-header">
                    <span className="fw-bold fs-6">{faq.question}</span>
                  </Accordion.Header>
                  <Accordion.Body className="faq-item-body text-muted-theme">
                    {faq.answer}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FaqPage;
