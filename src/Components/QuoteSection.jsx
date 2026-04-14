import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
import "../styles/quoteSection.css";

export default function QuoteSection() {
  const [formData, setFormData] = useState({
    item: "",
    details: "",
    quantity: "",
    unit: "Pcs",
  });

  const [showModal, setShowModal] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data submitted: ", formData);

    setFormData({
      item: "",
      details: "",
      quantity: "",
      unit: "Pcs",
    });

    setShowModal(false);
  };

  const isFormValid =
    formData.item.trim() !== "" &&
    formData.details.trim() !== "" &&
    formData.quantity.trim() !== "";

  const formContent = (
    <Form className="text-start" onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="What item you need?"
          name="item"
          value={formData.item}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Type more details"
          name="details"
          value={formData.details}
          onChange={handleChange}
        />
      </Form.Group>

      <Row className="mb-3 g-2">
        <Col xs={8}>
          <Form.Control
            type="number"
            placeholder="Quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
          />
        </Col>
        <Col xs={4}>
          <Form.Select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          >
            <option value="Pcs">Pcs</option>
            <option value="Kg">Kg</option>
            <option value="Box">Box</option>
          </Form.Select>
        </Col>
      </Row>

      <div className="d-flex justify-content-start">
        <Button
          variant="primary"
          type="submit"
          className="fw-bold px-4 custom-submit-btn"
          disabled={!isFormValid}
        >
          Send inquiry
        </Button>
      </div>
    </Form>
  );

  return (
    <Container className="mt-4 mb-4">
      <div id="quote-section" className="quote-banner p-4 p-md-5">
        <Row className="align-items-start">
          <Col md={6} lg={7} className="text-white text-start mb-4 mb-md-0">
            <h2 className="fw-bold mb-3 quote-title">
              An easy way to send requests to all suppliers
            </h2>
            {!isMobile && (
              <p className="quote-subtitle">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt.
              </p>
            )}
            {isMobile && (
              <Button
                variant="primary"
                className="mt-2 fw-bold px-4 custom-submit-btn"
                onClick={() => setShowModal(true)}
              >
                Send inquiry
              </Button>
            )}
          </Col>
          {!isMobile && (
            <Col md={6} lg={5}>
              <div className="quote-form-card p-4 rounded-3 shadow-sm">
                <h5 className="fw-bold mb-3 text-start">
                  Send quote to suppliers
                </h5>
                {formContent}
              </div>
            </Col>
          )}
        </Row>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="quote-form-card border-bottom-0">
          <Modal.Title className="fw-bold fs-5">
            Send quote to suppliers
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="quote-form-card pt-0">{formContent}</Modal.Body>
      </Modal>
    </Container>
  );
}
