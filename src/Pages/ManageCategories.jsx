import { useState, useEffect, useContext } from "react";
import { Table, Button, Modal, Form, Spinner, Alert, Pagination } from "react-bootstrap";
import { FaPlus, FaPencilAlt, FaTrash, FaImage, FaTags } from "react-icons/fa";
import { AppContext } from "../Contexts/AppContext";
import { api_config } from "../Config/api";

export default function ManageCategories() {
  const { lang } = useContext(AppContext);
  
  // ---------------- 1. الحالات (States) ----------------
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // حالات نظام الصفحات (Server-Side Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // حالات النافذة المنبثقة (Modal)
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  // حالات النموذج (Form)
  const [formData, setFormData] = useState({
    name: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  // ---------------- 2. جلب البيانات من السيرفر ----------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        // نرسل رقم الصفحة الحالية للـ API
        const res = await fetch(`${api_config.BASE_URL}/category?page=${currentPage}`, {
          headers: { "Accept-Language": lang },
        });
        const data = await res.json();
        
        if (data.code === 1) {
          setCategories(data.data || []);
          // تحديث إجمالي الصفحات من الـ meta
          if (data.meta && data.meta.last_page) {
            setTotalPages(data.meta.last_page);
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [lang, currentPage]);

  // ---------------- 3. دوال التحكم (Handlers) ----------------
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setEditMode(false);
    setFormData({ name: "" });
    setSelectedImage(null);
    setMessage(null);
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditMode(true);
    setCurrentCategoryId(category.id);
    setFormData({
      name: category.name || "",
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
      ? `${api_config.BASE_URL}/category/${currentCategoryId}` 
      : `${api_config.BASE_URL}/category`;

    const token = localStorage.getItem("user_token");

    let body;
    let headers = {
      "Accept": "application/json",
      "Accept-Language": lang,
      "Authorization": `Bearer ${token}` 
    };

    if (editMode) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(formData);
    } else {
      body = new FormData();
      Object.keys(formData).forEach(key => body.append(key, formData[key]));
      if (selectedImage) body.append("image", selectedImage);
    }

    fetch(url, { method, headers, body })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 1) {
          if (editMode) {
            setCategories(prev => prev.map(c => c.id === currentCategoryId ? { ...c, ...formData } : c));
          } else {
            setCurrentPage(1); 
            setCategories([]); // لإجبار التحديث من السيرفر
          }
          setShowModal(false);
        } else {
          setMessage({ type: "danger", text: result.message || "Error occurred" });
        }
      })
      .catch(() => {
        setMessage({ type: "danger", text: "Network Error." });
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleDeleteCategory = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    const oldCategories = [...categories];
    setCategories(prev => prev.filter(c => c.id !== id));

    const token = localStorage.getItem("user_token");

    fetch(`${api_config.BASE_URL}/category/${id}`, {
      method: "DELETE",
      headers: { 
        "Accept": "application/json",
        "Accept-Language": lang,
        "Authorization": `Bearer ${token}`
      } 
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Server Error");
        return res.json();
      })
      .then(result => {
        if (result.code !== 1) {
          setCategories(oldCategories); 
          alert(result.message || "Failed to delete.");
        } else {
          if (categories.length === 1 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
          }
        }
      })
      .catch((error) => {
        console.error(error);
        setCategories(oldCategories); 
        alert("حدث خطأ في السيرفر أثناء الحذف.");
      });
  };

  // ---------------- 4. واجهة المستخدم (Render) ----------------
  return (
    <div className="admin-page-container">
      
      {/* الترويسة */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4 pb-3 border-bottom border-secondary border-opacity-10 gap-3">
        <div>
          <h3 className="fw-bold text-main-theme m-0">Manage Categories</h3>
          <p className="text-muted small m-0 mt-1">Organize your store by managing product categories.</p>
        </div>
        <Button variant="primary" className="btn-accent border-0 d-flex align-items-center gap-2" onClick={openAddModal}>
          <FaPlus /> Add New Category
        </Button>
      </div>

      {/* الجدول والباجينيشن */}
      <div className="admin-table-wrapper bg-card-theme rounded-4 p-3 border border-secondary border-opacity-10 shadow-sm overflow-auto">
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" className="text-accent" />
          </div>
        ) : categories.length > 0 ? (
          <>
            <Table hover responsive className="admin-custom-table align-middle m-0 text-start">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Products Count</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <div className="admin-product-img-sm bg-input-theme rounded border d-flex justify-content-center align-items-center overflow-hidden">
                          {category.image ? (
                            <img src={category.image} alt={category.name || "Category"} />
                          ) : (
                            <FaImage className="text-muted opacity-50" />
                          )}
                        </div>
                        <div>
                          <h6 className="product-name-truncate fw-bold text-main-theme m-0">
                            {category.name || "Unnamed Category"}
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-muted fw-medium">
                        {category.categories_count} Products
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button className="action-btn-sm edit" onClick={() => openEditModal(category)} title="Edit">
                          <FaPencilAlt />
                        </button>
                        <button className="action-btn-sm delete" onClick={() => handleDeleteCategory(category.id)} title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* نظام عرض أرقام الصفحات */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4 border-top border-secondary border-opacity-10 pt-4">
                <Pagination className="admin-pagination m-0">
                  <Pagination.Prev 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(prev => prev - 1)} 
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
                    onClick={() => setCurrentPage(prev => prev + 1)} 
                  />
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5 text-muted">
            <FaTags size={40} className="mb-3 opacity-50" />
            <h5>No categories found.</h5>
          </div>
        )}
      </div>

      {/* النافذة المنبثقة (Modal) */}
      <Modal 
        show={showModal} 
        onHide={() => !isSubmitting && setShowModal(false)} 
        centered 
        contentClassName="admin-modal-theme rounded-4"
      >
        <Modal.Header closeButton className="border-bottom border-secondary border-opacity-10 text-start">
          <Modal.Title className="fw-bold text-main-theme">
            {editMode ? "Edit Category" : "Add New Category"}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4 text-start">
          {message && <Alert variant={message.type}>{message.text}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-main-theme fw-medium">Category Name</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required className="custom-light-input text-main-theme" />
            </Form.Group>
            
            {!editMode && (
              <Form.Group className="mb-4">
                <Form.Label className="text-main-theme fw-medium">Image</Form.Label>
                <Form.Control type="file" onChange={(e) => setSelectedImage(e.target.files[0])} className="custom-light-input text-main-theme p-2" />
              </Form.Group>
            )}
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="outline-secondary" onClick={() => setShowModal(false)} disabled={isSubmitting} className="cancel-btn-theme">Cancel</Button>
              <Button variant="primary" type="submit" disabled={isSubmitting} className="btn-accent border-0 px-4">
                {isSubmitting ? <Spinner size="sm" /> : (editMode ? "Save Changes" : "Add Category")}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

    </div>
  );
}