import { Row, Col } from "react-bootstrap";
import { FaLock, FaCommentDots, FaTruck } from "react-icons/fa";

export default function CartFeatures() {
  const features = [
    { icon: <FaLock size={20} />, title: "Secure payment", desc: "Have you ever finally just" },
    { icon: <FaCommentDots size={20} />, title: "Customer support", desc: "Have you ever finally just" },
    { icon: <FaTruck size={20} />, title: "Free delivery", desc: "Have you ever finally just" },
  ];

  return (
    <Row className="g-3 mt-4 text-start">
      {features.map((feat, idx) => (
        <Col md={4} key={idx}>
          <div className="d-flex align-items-center gap-3">
            <div className="feature-icon-wrapper rounded-circle d-flex align-items-center justify-content-center text-muted-theme border">
              {feat.icon}
            </div>
            <div>
              <h6 className="fw-bold text-main-theme mb-1">{feat.title}</h6>
              <p className="text-muted-theme mb-0 fs-sm">{feat.desc}</p>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
}