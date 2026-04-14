import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaSearch, FaBox, FaPaperPlane, FaShieldAlt } from "react-icons/fa";
import "../styles/extraServices.css";

const iconMap = {
  FaSearch: <FaSearch />,
  FaBox: <FaBox />,
  FaPaperPlane: <FaPaperPlane />,
  FaShieldAlt: <FaShieldAlt />,
};

export default function ExtraServicesSection() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("/data/mockdata.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.extraServicesData) {
          setServices(data.extraServicesData);
        }
      })
      .catch((err) => console.error("Error fetching extra services:", err));
  }, []);

  if (!services || services.length === 0) return null;

  return (
    <Container className="mt-5 mb-5">
      <h3 className="extra-services-title mb-4">Our extra services</h3>
      <Row className="g-3 justify-content-center">
        {services.map((service) => (
          <Col key={service.id} xs={12} sm={6} lg={3}>
            <div className="service-card">
              <div
                className="service-img-wrapper"
                style={{ backgroundImage: `url(${service.img})` }}
              >
                <div className="icon-container-outer">
                  <div className="icon-container-inner">
                    {iconMap[service.iconName]}
                  </div>
                </div>
              </div>
              <div className="service-info">
                <p className="service-text mb-0">{service.title}</p>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
