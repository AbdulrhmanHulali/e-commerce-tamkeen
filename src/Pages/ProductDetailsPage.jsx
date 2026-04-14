import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Container, Row, Col, Breadcrumb, Spinner } from "react-bootstrap";
import useProductDetails from "../Hooks/useProductDetails";
import ProductGallery from "../Components/ProductDetails/ProductGallery";
import ProductInfo from "../Components/ProductDetails/ProductInfo";
import SupplierCard from "../Components/ProductDetails/SupplierCard";
import ProductTabs from "../Components/ProductDetails/ProductTabs";
import RelatedProducts from "../Components/ProductDetails/RelatedProducts";
import RelatedProductsHorizontal from "../Components/ProductDetails/RelatedProductsHorizontal";
import DiscountBanner from "../Components/ProductDetails/DiscountBanner";
import "../styles/productDetails.css";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { product, isLoading } = useProductDetails(id);

  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const [currentVariant, setCurrentVariant] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="product-details-page d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page text-center pt-5">
        <h3 className="text-muted-theme">Product not found</h3>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <Container>
       <Breadcrumb className="custom-breadcrumb mb-3 d-none d-lg-flex">
          <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>{product.title}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="product-main-card mb-4">
          <Row className="g-4">
            <Col lg={4} md={12} xs={12}>
              <ProductGallery images={product.images} />
            </Col>
            <Col lg={5} md={7} xs={12}>
            <ProductInfo 
                product={{ ...product, id: product?.id || id }} 
                onVariantChange={setCurrentVariant} 
              />
            </Col>
            <Col lg={3} md={5} xs={12}>
              <SupplierCard
                product={{ ...product, id: product?.id || id }}
                supplier={product?.supplier}
                selectedVariant={currentVariant}
              />
              {!isMobile && (
                <div className="text-center mt-3">
                  <button 
                    className="btn btn-primary btn-inquiry shadow-none"
                    onClick={() => navigate("/supplier-profile")} 
                  >
                    Seller's profile
                  </button>
                </div>
              )}
            </Col>
          </Row>
        </div>
        {!isMobile && (
          <Row className="g-4">
            <Col lg={9} md={12}>
              <ProductTabs tabsData={product.tabsData} />
            </Col>
            <Col lg={3} md={12}>
              <RelatedProducts relatedItems={product.relatedProducts} />
            </Col>
          </Row>
        )}
                <div className="mt-4 mb-2">
          <RelatedProductsHorizontal products={product.relatedProducts} />
        </div>
                {!isMobile && <DiscountBanner />}
        
      </Container>
    </div>
  );
}