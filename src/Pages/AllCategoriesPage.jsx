import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";
import { AppContext } from "../Contexts/AppContext";
import { api_config } from "../../Config/API"; 
import { FaImage, FaChevronRight } from "react-icons/fa";

import "../styles/allcategory.css";

export default function AllCategoriesPage() {
  const { lang } = useContext(AppContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = () => {
      setIsLoading(true);
      fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.GET_ALL_CATEGORIES}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Language": lang,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.code === 1) {
            setCategories(result.data || []);
          }
        })
        .catch((err) => console.error("Error fetching categories:", err))
        .finally(() => setIsLoading(false));
    };

    fetchCategories();
  }, [lang]);

  return (
    <div className="py-5 custom-page-bg min-vh-100">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-main-theme m-0">
            All Categories
          </h2>
          <span className="text-muted-theme">
            {categories.length}{" "}
            Categories available
          </span>
        </div>

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" className="text-accent" />
          </div>
        ) : (
          <Row className="g-4">
            {categories.map((cat) => (
              <Col key={cat.id} xs={6} md={4} lg={3}>
                <Card
                  className="h-100 border-0 shadow-sm category-grid-card cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/category/${cat.id}`)}
                >
                  <div className="category-img-box d-flex align-items-center justify-content-center p-4">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="img-fluid category-img"
                      />
                    ) : (
                      <div className="empty-img-placeholder d-flex flex-column align-items-center opacity-50">
                        <FaImage size={40} className="mb-2" />
                        <span className="small text-uppercase">No Image</span>
                      </div>
                    )}
                  </div>

                  <Card.Body className="category-card-body d-flex justify-content-between align-items-center">
                    <div>
                      <Card.Title className="category-card-title fw-bold mb-1 fs-6 text-capitalize">
                        {cat.name}
                      </Card.Title>
                      <Card.Text className="category-card-text small mb-0">
                        {cat.categories_count}{" "}
                        Subcategories
                      </Card.Text>
                    </div>
                    <div className="category-arrow-icon">
                      <FaChevronRight
                        style={{
                          transform: lang === "ar" ? "rotate(180deg)" : "none",
                        }}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}

            {!isLoading && categories.length === 0 && (
              <div className="text-center py-5 text-muted-theme">
                No categories found.
              </div>
            )}
          </Row>
        )}
      </Container>
    </div>
  );
}
