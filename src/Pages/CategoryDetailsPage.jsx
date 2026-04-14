import { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Spinner,
  Alert,
  Button,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router";
import { AppContext } from "../Contexts/AppContext";
import { api_config } from "../Config/api";
import CategoryItemCard from "../Components/CategoryItemCard";

import "../styles/categoryDetailsPage.css";

export default function CategoryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang } = useContext(AppContext);

  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
      `${api_config.BASE_URL}${api_config.ENDPOINTS.GET_CATEGORY_DETAILS}${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Language": lang || "en",
        },
      },
    )
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 1) {
          setCategoryData(result.data);
        } else {
          setError(result.message || "Failed to load category details");
        }
      })
      .catch((err) => {
        console.error("Error fetching category details:", err);
        setError("An error occurred while fetching data.");
      })
      .finally(() => setIsLoading(false));
  }, [id, lang]);

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <Container className="py-5 text-center min-vh-100">
        <Alert variant="danger" className="mb-4">
          {error || "Category not found"}
        </Alert>
        <Button
          variant="outline-secondary"
          className="px-4 py-2 fw-bold"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const {
    name,
    category: parentCategory,
    categories: subcategories,
  } = categoryData;

  return (
    <div
      className="category-details-page pb-5"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <Container className="pt-4 text-start">
        <Breadcrumb className="custom-breadcrumb mb-3">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
            Home
          </Breadcrumb.Item>
          {parentCategory && (
            <Breadcrumb.Item
              linkAs={Link}
              linkProps={{ to: `/category/${parentCategory.id}` }}
            >
              {parentCategory.name}
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item active>{name}</Breadcrumb.Item>
        </Breadcrumb>

        <div className="mb-4 pb-2 border-bottom border-secondary border-opacity-10 d-flex justify-content-start">
          <h3 className="fw-bold text-main-theme text-capitalize m-0">
            {name}
          </h3>
        </div>

        {subcategories && subcategories.length > 0 ? (
          <Row className="g-3 g-md-4">
            {subcategories.map((sub) => (
              <Col xs={6} md={4} lg={3} key={sub.id}>
                <div
                  className="h-100 cursor-pointer text-decoration-none simple-category-card"
                  onClick={() => navigate(`/category/${sub.id}`)}
                >
                  <CategoryItemCard
                    title={sub.name}
                    price=""
                    image={
                      sub.image ||
                      "https://placehold.co/200x200/f8f9fa/a3a3a3?text=No+Image"
                    }
                  />
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5 bg-card-theme rounded border border-secondary border-opacity-10 mt-4">
            <h5 className="text-muted mb-4 fw-normal">
              No subcategories found
            </h5>
          </div>
        )}
      </Container>

      <div className="mt-5"></div>
    </div>
  );
}
