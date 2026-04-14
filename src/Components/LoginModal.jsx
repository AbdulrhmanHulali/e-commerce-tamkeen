import { useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { AppContext } from "../Contexts/AppContext";
import "../styles/loginModal.css"

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, theme } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  return (
    <Modal
      show={showLoginModal}
      onHide={() => setShowLoginModal(false)}
      centered
      contentClassName="bg-transparent border-0"
    >
      {/* 2. استخدام الكلاسات بدلاً من الـ inline styles */}
      <div className="custom-modal-content shadow-lg">
        <Modal.Header
          closeButton
          className="border-bottom-0"
          closeVariant={theme === "dark" ? "white" : undefined}
        >
          <Modal.Title className="fw-bold fs-5">Sign in required</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center py-4 px-4">
          <p className="mb-4 custom-modal-text">
            Please log in or create an account to view this section and complete
            your purchase.
          </p>

          <Button
            className="w-100 fw-bold mb-3 py-2 shadow-none custom-login-btn"
            onClick={handleLoginClick}
          >
            Log in
          </Button>

          <Button
            variant="outline-secondary"
            className="w-100 fw-bold py-2 shadow-none custom-guest-btn"
            onClick={() => setShowLoginModal(false)}
          >
            Continue surfing as a guest
          </Button>
        </Modal.Body>
      </div>
    </Modal>
  );
}