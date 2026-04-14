import { Container } from "react-bootstrap";
import { FaTools } from "react-icons/fa";

export default function SupplierProfilePage() {
  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center text-center"
    >
      <FaTools className="text-muted mb-3" size={50} opacity={0.5} />
      <h2 className="fw-bold" style={{ color: "var(--main-text)" }}>
        Supplier Profile
      </h2>
      <p className="text-muted fs-5 mt-2">
        This page is coming soon! Stay tuned.
      </p>
    </Container>
  );
}
