import { useState } from "react";
import { Container, Form, Button, InputGroup } from "react-bootstrap";
import { FaEnvelope } from "react-icons/fa";
import "../styles/newsletter.css";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const isEmailValid = email.includes("@") && email.includes(".");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEmailValid) {
      setEmail("");
    }
  };

  return (
    <section className="newsletter-section py-5">
      <Container className="text-center">
        <h3 className="newsletter-title mb-2">Subscribe on our newsletter</h3>
        <p className="newsletter-subtitle mb-4">
          Get daily news on upcoming offers from many suppliers all over the
          world
        </p>

        <Form onSubmit={handleSubmit} className="mx-auto newsletter-form">
          <InputGroup className="mb-3">
            <InputGroup.Text className="newsletter-icon-box">
              <FaEnvelope />
            </InputGroup.Text>

            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="newsletter-input shadow-none"
            />
            <Button
              type="submit"
              className="px-4 fw-bold newsletter-btn"
              disabled={!isEmailValid}
            >
              Subscribe
            </Button>
          </InputGroup>
        </Form>
      </Container>
    </section>
  );
}
