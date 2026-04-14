import { useState, useRef, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Card,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import {
  FaUser,
  FaBoxOpen,
  FaBox,
  FaHeart,
  FaInfoCircle,
  FaPhoneAlt,
  FaQuestionCircle,
  FaFileContract,
  FaUserShield,
  FaSignOutAlt,
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";

import { api_config } from "../../Config/API"; 
import { AppContext } from "../Contexts/AppContext";
import MyProducts from "../Pages/MyProducts";

import "../styles/profile.css";

const AVATAR_VARIANTS = [
  { id: 1, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
  { id: 2, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" },
  { id: 3, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mimi" },
  { id: 4, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Buster" },
  { id: 5, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Salem" },
  { id: 6, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia" },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { lang, login, logout } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("personal");

  const [editingField, setEditingField] = useState(null);
  const [isSavingField, setIsSavingField] = useState(false);

  const [isLoading, setIsLoading] = useState(
    () => !!localStorage.getItem("user_token"),
  );
  const [statusMessage, setStatusMessage] = useState(null);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nickName: "",
    image: "",
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.PROFILE}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((result) => {
        const userData = result.data.user;
        const nameParts = (userData.name || "").split(" ");

        const fetchedData = {
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: userData.email || "",
          phone: userData.phone || "",
          nickName: userData.name || "",
          image: userData.image || result.data.avatar || "",
        };

        setFormData(fetchedData);
        setOriginalData(fetchedData);
      })
      .catch((err) => console.error("Fetch Profile Error:", err))
      .finally(() => setIsLoading(false));
  }, [lang]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      uploadAvatar(file);
    }
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const uploadAvatar = (file) => {
    const apiPayload = new FormData();
    apiPayload.append("image", file);
    sendAvatarRequest(apiPayload, URL.createObjectURL(file), "Avatar updated!");
  };

  const handleSelectAvatarVariant = (variant) => {
    const apiPayload = new FormData();
    apiPayload.append("avatar_variant_id", variant.id);
    sendAvatarRequest(apiPayload, variant.url, "Avatar variant selected!");
  };

  const handleDeleteAvatar = () => {
    if (
      !window.confirm("Are you sure you want to delete your profile picture?")
    )
      return;

    const apiPayload = new FormData();
    apiPayload.append("image", "");
    apiPayload.append("avatar_variant_id", "");
    apiPayload.append("delete_image", "1");

    sendAvatarRequest(apiPayload, null, "Avatar deleted successfully!");
  };

  const sendAvatarRequest = (apiPayload, newPreviewUrl, successText) => {
    setIsSavingField(true);
    const token = localStorage.getItem("user_token");

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.UPDATE_PROFILE}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
      },
      body: apiPayload,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Avatar update failed");
        return res.json();
      })
      .then((result) => {
        setStatusMessage({ type: "success", text: successText });

        const finalImage = result.data?.avatar || newPreviewUrl || "";

        setPreviewImage(finalImage);
        setFormData((prev) => ({ ...prev, image: finalImage }));

        login({
          ...formData,
          image: finalImage,
          id: result.data?.id || formData.id,
        });

        setShowAvatarModal(false);
        setTimeout(() => setStatusMessage(null), 3000);
      })
      .catch(() => {
        setStatusMessage({ type: "danger", text: "Failed to update avatar" });
        setPreviewImage(null);
      })
      .finally(() => setIsSavingField(false));
  };

  const handleFieldSave = (fieldName) => {
    if (formData[fieldName] === originalData[fieldName]) {
      setEditingField(null);
      return;
    }

    setIsSavingField(true);
    const token = localStorage.getItem("user_token");
    const apiPayload = new FormData();
    let updatedFullName = `${originalData.firstName} ${originalData.lastName}`;

    if (fieldName === "firstName" || fieldName === "lastName") {
      updatedFullName = `${formData.firstName} ${formData.lastName}`;
      apiPayload.append("name", updatedFullName);
    } else if (fieldName === "email") {
      apiPayload.append("email", formData.email);
    } else if (fieldName === "phone") {
      apiPayload.append("phone", formData.phone);
    }

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.UPDATE_PROFILE}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
      },
      body: apiPayload,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed");
        return res.json();
      })
      .then((result) => {
        setStatusMessage({ type: "success", text: "Updated successfully!" });
        setOriginalData((prev) => ({
          ...prev,
          [fieldName]: formData[fieldName],
        }));
        setEditingField(null);

        if (fieldName === "firstName" || fieldName === "lastName") {
          login({ ...formData, name: updatedFullName, id: result.data.id });
        }
        setTimeout(() => setStatusMessage(null), 3000);
      })
      .catch((err) => {
        setStatusMessage({
          type: "danger",
          text: err.message || "Failed to update",
        });
      })
      .finally(() => setIsSavingField(false));
  };

  const handleCancelEdit = (fieldName) => {
    setFormData({ ...formData, [fieldName]: originalData[fieldName] });
    setEditingField(null);
  };

  const renderAvatar = (className) => {
    const avatarUrl = previewImage || formData.image;
    if (avatarUrl)
      return <img src={avatarUrl} alt="User Avatar" className={className} />;
    return (
      <div
        className={`${className} d-flex justify-content-center align-items-center default-avatar-placeholder`}
      >
        <FaUser size={className.includes("sidebar") ? 30 : 40} />
      </div>
    );
  };

  const navLinks = [
    { id: "personal", label: "Personal Info", icon: FaUser },
    { id: "my-products", label: "My Products", icon: FaBox },
    { id: "orders", label: "My Orders", icon: FaBoxOpen, path: "/orders" },
    { id: "wishlist", label: "Wishlist", icon: FaHeart, path: "/wishlist" },
  ];

  const pageLinks = [
    { label: "About Us", path: "/about", icon: FaInfoCircle },
    { label: "Contact Us", path: "/contact-us", icon: FaPhoneAlt },
    { label: "FAQ", path: "/faq", icon: FaQuestionCircle },
    { label: "Terms & Conditions", path: "/terms", icon: FaFileContract },
    { label: "Privacy Policy", path: "/privacy", icon: FaUserShield },
  ];

  const formInputs = [
    { name: "firstName", label: "First Name", type: "text", col: 6 },
    { name: "lastName", label: "Last Name", type: "text", col: 6 },
    { name: "email", label: "Email Address", type: "email", col: 6 },
    { name: "phone", label: "Phone Number", type: "text", col: 6 },
    {
      name: "nickName",
      label: "Nick Name",
      type: "text",
      col: 12,
      noEdit: true,
    },
  ];

  return (
    <div className="py-4 py-md-5 profile-page-wrapper">
      <Container>
        {isLoading && !originalData ? (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <Spinner
              animation="border"
              style={{
                color: "var(--accent-color)",
                width: "3rem",
                height: "3rem",
              }}
            />
            <span className="mt-3 text-muted fw-medium fs-5">
              Loading Profile...
            </span>
          </div>
        ) : (
          <Row className="g-4">
            <Col lg={3} md={4}>
              <Card className="profile-sidebar-card shadow-sm border-0">
                <div className="sidebar-profile-header text-center p-4 border-bottom border-secondary border-opacity-10">
                  {renderAvatar("sidebar-avatar mb-3 shadow-sm")}
                  <h6 className="fw-bold mb-1 text-main-theme">
                    {originalData?.firstName} {originalData?.lastName}
                  </h6>
                  <small className="text-muted">{originalData?.email}</small>
                </div>

                <ListGroup variant="flush" className="profile-list-group p-2">
                  {navLinks.map((link) => (
                    <ListGroup.Item
                      key={link.id}
                      action
                      className={`profile-list-item ${activeTab === link.id ? "active" : ""}`}
                      onClick={() =>
                        link.path ? navigate(link.path) : setActiveTab(link.id)
                      }
                    >
                      <link.icon className="list-icon" /> {link.label}
                    </ListGroup.Item>
                  ))}

                  <hr className="my-2 border-secondary border-opacity-25" />
                  <div className="px-3 py-2 text-muted fw-bold profile-sidebar-section-title">
                    More Pages
                  </div>
                  {pageLinks.map((page, index) => (
                    <ListGroup.Item
                      key={index}
                      action
                      className="profile-list-item"
                      onClick={() => navigate(page.path)}
                    >
                      <page.icon className="list-icon opacity-50" />{" "}
                      {page.label}
                    </ListGroup.Item>
                  ))}

                  <hr className="my-2 border-secondary border-opacity-25" />
                  <ListGroup.Item
                    action
                    className="profile-list-item text-danger logout-item mt-1"
                    onClick={logout}
                  >
                    <FaSignOutAlt className="list-icon" /> Logout
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>

            <Col lg={9} md={8}>
              <Card className="profile-content-card shadow-sm border-0 h-100">
                {activeTab === "personal" && (
                  <div className="p-4 p-md-5">
                    <div className="mb-4 pb-3 border-bottom border-secondary border-opacity-10">
                      <h4 className="fw-bold m-0 text-main-theme">
                        Personal Information
                      </h4>
                    </div>

                    {statusMessage && (
                      <Alert
                        variant={statusMessage.type}
                        onClose={() => setStatusMessage(null)}
                        dismissible
                        className="mb-4 fw-medium shadow-sm border-0"
                      >
                        {statusMessage.text}
                      </Alert>
                    )}

                    <div className="d-flex align-items-center mb-5 flex-wrap gap-3">
                      <div className="profile-avatar-wrapper">
                        {renderAvatar("profile-avatar-img shadow-sm")}
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          className="d-none"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                        />
                        <button
                          className="avatar-edit-btn shadow"
                          onClick={handleCameraClick}
                          disabled={isSavingField}
                          title={"Upload Custom Image"}
                        >
                          <FaCamera size={14} />
                        </button>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-1 text-main-theme">
                          Profile Picture
                        </h5>
                        <p className="text-muted small m-0 mb-3">
                          PNG, JPEG under 15MB
                        </p>
                        <div className="d-flex gap-2 mt-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="btn-outline-accent rounded-pill px-3 fw-medium"
                            onClick={() => setShowAvatarModal(true)}
                            disabled={isSavingField}
                          >
                            {"Choose Avatar"}
                          </Button>

                          {(previewImage || formData.image) && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="rounded-pill px-3 fw-medium"
                              onClick={handleDeleteAvatar}
                              disabled={isSavingField}
                            >
                              Delete Picture
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <Form>
                      <Row className="g-4">
                        {formInputs.map((input, idx) => (
                          <Col md={input.col} key={idx}>
                            <Form.Group className="position-relative">
                              <Form.Label className="input-label-text fw-medium d-flex justify-content-between">
                                {input.label}
                              </Form.Label>

                              <div className="d-flex align-items-center position-relative">
                                <Form.Control
                                  type={input.type}
                                  name={input.name}
                                  value={formData[input.name]}
                                  onChange={handleChange}
                                  className={`custom-light-input ${editingField !== input.name ? "readonly-input" : ""}`}
                                  readOnly={editingField !== input.name}
                                />

                                {!input.noEdit &&
                                  editingField !== input.name && (
                                    <Button
                                      variant="link"
                                      className="position-absolute text-muted text-decoration-none field-edit-btn"
                                      onClick={() =>
                                        setEditingField(input.name)
                                      }
                                    >
                                      <FaEdit />
                                    </Button>
                                  )}
                              </div>

                              {editingField === input.name && (
                                <div className="d-flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="success"
                                    className="d-flex align-items-center gap-1"
                                    onClick={() => handleFieldSave(input.name)}
                                    disabled={isSavingField}
                                  >
                                    {isSavingField ? (
                                      <Spinner size="sm" />
                                    ) : (
                                      <FaSave />
                                    )}{" "}
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline-secondary"
                                    className="d-flex align-items-center gap-1"
                                    onClick={() => handleCancelEdit(input.name)}
                                    disabled={isSavingField}
                                  >
                                    <FaTimes /> Cancel
                                  </Button>
                                </div>
                              )}
                            </Form.Group>
                          </Col>
                        ))}
                      </Row>
                    </Form>
                  </div>
                )}
                {activeTab === "my-products" && <MyProducts />}
              </Card>
            </Col>
          </Row>
        )}
      </Container>

      <Modal
        show={showAvatarModal}
        onHide={() => setShowAvatarModal(false)}
        centered
        contentClassName="custom-avatar-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-main-theme">
            Choose an Avatar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-wrap justify-content-center gap-3 p-3">
            {AVATAR_VARIANTS.map((variant) => (
              <div
                key={variant.id}
                className="avatar-variant-option"
                onClick={() => handleSelectAvatarVariant(variant)}
              >
                <img
                  src={variant.url}
                  alt={`Avatar ${variant.id}`}
                  className="rounded-circle shadow-sm"
                  width="80"
                  height="80"
                />
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProfilePage;
