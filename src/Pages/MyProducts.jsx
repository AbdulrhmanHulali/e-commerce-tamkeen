import { useState, useContext, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FaPlus,
  FaBox,
  FaImage,
  FaUpload,
  FaTrash,
  FaPencilAlt,
} from "react-icons/fa";
import { AppContext } from "../Contexts/AppContext";
import { api_config } from "../Config/api";
import "../styles/myProducts.css";

export default function MyProducts() {
  const { lang, formatPrice } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category_id: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.GET_ALL_CATEGORIES}`, {
      headers: { "Accept-Language": lang },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 1) setCategories(result.data);
      });
  }, [lang]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditMode(false);
    setFormData({ name: "", price: "", description: "", category_id: "" });
    setSelectedImage(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setCurrentProductId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      category_id: product.category?.id || "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const token = localStorage.getItem("user_token");
    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? `${api_config.BASE_URL}/product/${currentProductId}`
      : `${api_config.BASE_URL}/product`;

    let body;
    let headers = {
      Accept: "application/json",
      "Accept-Language": lang,
      Authorization: `Bearer ${token}`,
    };

    if (editMode) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(formData);
    } else {
      body = new FormData();
      Object.keys(formData).forEach((key) => body.append(key, formData[key]));
      if (selectedImage) body.append("image", selectedImage);
    }

    const oldProducts = [...products];

    fetch(url, { method, headers, body })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 1) {
          if (editMode) {
            setProducts((prev) =>
              prev.map((p) => (p.id === currentProductId ? result.data : p)),
            );
          } else {
            setProducts((prev) => [result.data, ...prev]);
          }
          setShowModal(false);
        } else {
          setProducts(oldProducts);
          setMessage({
            type: "danger",
            text: result.message || "Error occurred",
          });
        }
      })
      .catch(() => {
        setProducts(oldProducts);
        setMessage({
          type: "danger",
          text: "Server Error (500). Reverting changes...",
        });
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm("Are you sure?")) return;
    const oldProducts = [...products];
    setProducts((prev) => prev.filter((p) => p.id !== id));

    fetch(`${api_config.BASE_URL}/product/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        "Accept-Language": lang,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code !== 1) setProducts(oldProducts);
      })
      .catch(() => setProducts(oldProducts));
  };

  return (
    <div className="my-products-wrapper p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h4 className="fw-bold m-0 text-main-theme">
          <FaBox className="text-accent" /> My Products
        </h4>
        <Button
          variant="primary"
          className="btn-accent border-0"
          onClick={openAddModal}
        >
          <FaPlus /> Add New
        </Button>
      </div>

      <Row className="g-4">
        {products.map((product) => (
          <Col xs={12} sm={6} lg={4} key={product.id}>
            <Card className="my-product-card h-100 shadow-sm border-0 position-relative">
              <div className="action-buttons-overlay">
                <button
                  className="action-btn edit-btn"
                  onClick={() => openEditModal(product)}
                >
                  <FaPencilAlt />
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <FaTrash />
                </button>
              </div>
              <div className="product-img-placeholder d-flex align-items-center justify-content-center">
                {product.image ? (
                  <img src={product.image} alt="" className="img-fluid" />
                ) : (
                  <FaImage size={30} className="opacity-25" />
                )}
              </div>
              <Card.Body className="text-start p-3">
                <h6 className="fw-bold text-main-theme text-truncate">
                  {product.name}
                </h6>
                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <span className="fw-bold text-accent">
                    {formatPrice(product.price)}
                  </span>
                  <small className="text-muted">SKU: {product.sku}</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        show={showModal}
        onHide={() => !isSubmitting && setShowModal(false)}
        centered
        contentClassName="custom-product-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold text-main-theme">
            {editMode ? "Edit Product" : "Add Product"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-start">
          {message && <Alert variant={message.type}>{message.text}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-main-theme fw-medium">
                Name
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="custom-light-input text-main-theme"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-main-theme fw-medium">
                Category
              </Form.Label>
              <Form.Select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                required
                className="custom-light-input text-main-theme"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-main-theme fw-medium">
                Price
              </Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="custom-light-input text-main-theme"
              />
            </Form.Group>

            {!editMode && (
              <Form.Group className="mb-3">
                <Form.Label className="text-main-theme fw-medium">
                  Image
                </Form.Label>
                <div className="custom-file-upload">
                  <Form.Control
                    type="file"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    className="d-none"
                    id="product-image-upload"
                  />
                  <label
                    htmlFor="product-image-upload"
                    className="w-100 p-3 border rounded text-center cursor-pointer bg-input-theme text-main-theme d-block text-truncate"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <FaUpload className="me-2 text-accent" />
                    <span>
                      {selectedImage
                        ? selectedImage.name
                        : "Choose an image..."}
                    </span>
                  </label>
                </div>
              </Form.Group>
            )}

            <Form.Group className="mb-4">
              <Form.Label className="text-main-theme fw-medium">
                Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="custom-light-input text-main-theme"
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="outline-secondary"
                onClick={() => setShowModal(false)}
                disabled={isSubmitting}
                className="text-main-theme"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="btn-accent border-0 px-4"
              >
                {isSubmitting ? (
                  <Spinner size="sm" />
                ) : editMode ? (
                  "Save Changes"
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
