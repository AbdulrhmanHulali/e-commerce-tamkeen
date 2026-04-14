import { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Badge,
  Pagination,
} from "react-bootstrap";
import {
  FaPlus,
  FaPencilAlt,
  FaTrash,
  FaImage,
  FaBoxOpen,
} from "react-icons/fa";
import { AppContext } from "../Contexts/AppContext";
import { api_config } from "../../Config/API"; 

export default function ManageProducts() {
  const { lang, formatPrice } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    const fetchCategories = async () => {
      try {
        const catRes = await fetch(
          `${api_config.BASE_URL}${api_config.ENDPOINTS.GET_ALL_CATEGORIES}`,
          {
            headers: { "Accept-Language": lang },
          },
        );
        const catData = await catRes.json();
        if (catData.code === 1) setCategories(catData.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [lang]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const prodRes = await fetch(
          `${api_config.BASE_URL}${api_config.ENDPOINTS.PRODUCTS}?page=${currentPage}`,
          {
            headers: { "Accept-Language": lang },
          },
        );
        const prodData = await prodRes.json();

        if (prodData.code === 1) {
          setProducts(prodData.data || []);

          if (prodData.meta && prodData.meta.last_page) {
            setTotalPages(prodData.meta.last_page);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [lang, currentPage]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditMode(false);
    setFormData({ name: "", price: "", description: "", category_id: "" });
    setSelectedImage(null);
    setMessage(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setCurrentProductId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || "",
      category_id: product.category?.id || "",
    });
    setSelectedImage(null);
    setMessage(null);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const method = editMode ? "PUT" : "POST";
    const url = editMode
      ? `${api_config.BASE_URL}/product/${currentProductId}`
      : `${api_config.BASE_URL}/product`;

    const token = localStorage.getItem("user_token");

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

    fetch(url, { method, headers, body })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 1) {
          if (editMode) {
            setProducts((prev) =>
              prev.map((p) =>
                p.id === currentProductId ? { ...p, ...formData } : p,
              ),
            );
          } else {
            setCurrentPage(1);
            setProducts([]);
          }
          setShowModal(false);
        } else {
          setMessage({
            type: "danger",
            text: result.message || "Error occurred",
          });
        }
      })
      .catch(() => {
        setMessage({ type: "danger", text: "Network Error." });
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    const oldProducts = [...products];
    setProducts((prev) => prev.filter((p) => p.id !== id));

    const token = localStorage.getItem("user_token");

    fetch(`${api_config.BASE_URL}/product/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Accept-Language": lang,

        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Server Error Details:", errorText);
          throw new Error("Server Error");
        }
        return res.json();
      })
      .then((result) => {
        if (result.code !== 1) {
          setProducts(oldProducts);
          alert(result.message || "Failed to delete.");
        } else {
          if (products.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
        }
      })
      .catch((error) => {
        console.error(error);
        setProducts(oldProducts);
      });
  };

  return (
    <div className="admin-page-container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 pb-3 border-bottom border-secondary border-opacity-10 gap-3">
        <div>
          <h3 className="fw-bold text-main-theme m-0">Manage Products</h3>
          <p className="text-muted small m-0 mt-1">
            Manage your store products efficiently.
          </p>
        </div>
        <Button
          variant="primary"
          className="btn-accent border-0 d-flex align-items-center gap-2"
          onClick={openAddModal}
        >
          <FaPlus /> Add New Product
        </Button>
      </div>
      <div className="admin-table-wrapper bg-card-theme rounded-4 p-3 border border-secondary border-opacity-10 shadow-sm overflow-auto">
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" className="text-accent" />
          </div>
        ) : products.length > 0 ? (
          <>
            <Table
              hover
              responsive
              className="admin-custom-table align-middle m-0 text-start"
            >
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>SKU</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="admin-product-img-sm bg-input-theme rounded border d-flex justify-content-center align-items-center overflow-hidden">
                          {product.image ? (
                            <img src={product.image} alt={product.name} />
                          ) : (
                            <FaImage className="text-muted opacity-50" />
                          )}
                        </div>
                        <div>
                          <h6 className="product-name-truncate fw-bold text-main-theme m-0">
                            {product.name}
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge
                        bg="secondary"
                        className="bg-opacity-10 text-main-theme border fw-normal"
                      >
                        {product.category?.name || "Uncategorized"}
                      </Badge>
                    </td>
                    <td className="fw-bold text-accent">
                      {formatPrice
                        ? formatPrice(product.price)
                        : `$${product.price}`}
                    </td>
                    <td className="text-muted small">{product.sku || "-"}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="action-btn-sm edit"
                          onClick={() => openEditModal(product)}
                          title="Edit"
                        >
                          <FaPencilAlt />
                        </button>
                        <button
                          className="action-btn-sm delete"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4 border-top border-secondary border-opacity-10 pt-4">
                <Pagination className="admin-pagination m-0">
                  <Pagination.Prev
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  />
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5 text-muted">
            <FaBoxOpen size={40} className="mb-3 opacity-50" />
            <h5>No products found.</h5>
          </div>
        )}
      </div>
      <Modal
        show={showModal}
        onHide={() => !isSubmitting && setShowModal(false)}
        centered
        contentClassName="admin-modal-theme rounded-4"
      >
        <Modal.Header
          closeButton
          className="border-bottom border-secondary border-opacity-10 text-start"
        >
          <Modal.Title className="fw-bold text-main-theme">
            {editMode ? "Edit Product" : "Add New Product"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4 text-start">
          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-main-theme fw-medium">
                Product Name
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
                <option value="">Select Category...</option>
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
                <Form.Control
                  type="file"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  className="custom-light-input text-main-theme p-2"
                />
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
                className="cancel-btn-theme"
              >
                Cancel
              </Button>{" "}
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
