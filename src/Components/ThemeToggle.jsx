import { useContext, useState, useEffect } from "react";
import { AppContext } from "../Contexts/AppContext";
import { FaSun, FaMoon, FaCog, FaBell } from "react-icons/fa";
import { Modal, Spinner } from "react-bootstrap";
import "../styles/themeToggle.css";

export default function ThemeToggle() {
  const {
    theme,
    setTheme,
    lang,
    setLang,
    showNotifModal,
    setShowNotifModal,
    notifications,
    isNotifLoading,
  } = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  return (
    <>
      {!isMobile && (
        <div className="fab-container">
          <button
            className={`fab-btn fab-main ${isOpen ? "open" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
            title="Settings"
          >
            <FaCog className="fab-icon" />
          </button>
          <div className={`fab-options ${isOpen ? "open" : ""}`}>
            <button
              className="fab-btn fab-option shadow-sm"
              onClick={toggleTheme}
              title={theme === "light" ? "Dark Mode" : "Light Mode"}
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
            <button
              className="fab-btn fab-option shadow-sm"
              onClick={toggleLang}
              title={lang === "en" ? "Arabic" : "English"}
            >
              <span className="lang-text">{lang === "en" ? "AR" : "EN"}</span>
            </button>
          </div>
        </div>
      )}

      <Modal
        show={showNotifModal}
        onHide={() => setShowNotifModal(false)}
        centered
        scrollable
        contentClassName="custom-notif-modal"
      >
        <Modal.Header closeButton className="border-bottom custom-notif-header">
          <Modal.Title className="text-main-theme fw-bold fs-5">
            Notifications
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-notif-body p-0 text-start">
          {isNotifLoading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="list-group list-group-flush">
              {notifications.map((notif, index) => (
                <div
                  key={index}
                  className="list-group-item custom-notif-item p-3 border-bottom"
                >
                  <div className="d-flex align-items-start gap-3">
                    <div className="notif-icon-wrapper rounded-circle d-flex align-items-center justify-content-center">
                      <FaBell className="notif-icon" />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold text-main-theme mb-1">
                        {notif.title || "Notification"}
                      </h6>
                      <p className="text-muted-theme mb-1 small">
                        {notif.message ||
                          notif.body ||
                          "No additional details."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <FaBell size={40} className="notif-empty-icon opacity-50 mb-3" />
              <p className="text-muted-theme m-0">No notifications yet</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
