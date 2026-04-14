import {
  Container,
  Row,
  Col,
  Breadcrumb,
  Pagination,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useSearchParams } from "react-router";
import useCategoryPage from "../Hooks/useCategoryPage";
import ProductListCard from "../Components/ProductListCard";
import FilterSidebar from "../Components/CategoryPage/FilterSidebar";
import TopControlBar from "../Components/CategoryPage/TopControlBar";
import ActiveFiltersChips from "../Components/CategoryPage/ActiveFiltersChips";

import "../styles/ProductsPage.css";

export default function CategoryProductsPage() {
  const [searchParams] = useSearchParams();

  const filters = {
    category_id: searchParams.get("category_id"),
    search: searchParams.get("search"),
    price_from: searchParams.get("price_from"),
    price_to: searchParams.get("price_to"),
    order_by: searchParams.get("order_by"),
    order: searchParams.get("order"),
    page: searchParams.get("page") || 1,
  };

  const pageState = useCategoryPage(filters);
  const {
    products,
    pagination,
    isLoading,
    serverError,
    viewMode,
    categoriesList,
    handlePageChange,
  } = pageState;

  const currentCategoryName = filters.category_id
    ? categoriesList?.find((c) => c.id === Number(filters.category_id))?.name ||
      "Category Products"
    : "All Products";

  return (
    <div className="category-page-wrapper text-start">
      <Container>
        <Breadcrumb className="custom-breadcrumb mb-4 d-none d-md-flex">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>{currentCategoryName}</Breadcrumb.Item>
        </Breadcrumb>
        <Row className="g-4">
          <Col lg={3} className="d-none d-lg-block">
            <FilterSidebar pageState={pageState} prefix="desktop" />
          </Col>

          <Col lg={9} xs={12}>
            <TopControlBar pageState={pageState} />
            <ActiveFiltersChips pageState={pageState} />
            {serverError && (
              <Alert variant="danger" className="mb-4">
                {serverError}
              </Alert>
            )}
            <div
              className={`products-wrapper position-relative ${isLoading ? "opacity-50" : ""}`}
            >
              {isLoading && (
                <div
                  className="position-absolute w-100 h-100 d-flex justify-content-center align-items-start pt-5 loading-overlay"
                  style={{ zIndex: 10 }}
                >
                  <Spinner animation="border" variant="primary" />
                </div>
              )}
              {!isLoading &&
              (!products || products.length === 0) &&
              !serverError ? (
                <div className="text-center py-5">
                  <h4 className="text-muted">
                    No products found matching your filters.
                  </h4>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid" ? "row g-3" : "product-list-container"
                  }
                >
                  {products?.map((product) => (
                    <div
                      className={
                        viewMode === "grid" ? "col-6 col-md-4 col-lg-4" : ""
                      }
                      key={product.id}
                    >
                      <ProductListCard product={product} viewMode={viewMode} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {!isLoading && pagination && pagination.last_page > 1 && (
              <div className="d-flex flex-column flex-md-row justify-content-end align-items-center mt-4 gap-3">
                <Pagination className="custom-pagination mb-0">
                  <Pagination.Prev disabled={pagination.current_page === 1} onClick={() => handlePageChange(pagination.current_page - 1)} />

                  {pagination.links.map((link, index) => {
                    if (
                      link.label.includes("Previous") ||
                      link.label.includes("Next")
                    )
                      return null;
                    const pageNumber = Number(link.label);
                    if (isNaN(pageNumber)) {
                        return <Pagination.Ellipsis key={index} disabled />;
                    }
                    return (
                      <Pagination.Item 
                        key={index} 
                        active={link.active}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {link.label}
                      </Pagination.Item>
                    );
                  })}

                <Pagination.Next
                    disabled={pagination.current_page === pagination.last_page}
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                  />
                </Pagination>
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <div className="mt-5"></div>
    </div>
  );
}
