import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import CountdownTimer from "./CountdownTimer";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../styles/dealssection.css";

export default function DealsSection({ dealsData = [] }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [endDate] = useState(() => new Date(Date.now() + 86400000));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!dealsData || dealsData.length === 0) return null;

  return (
    <section className="pt-4 pb-3 deals-wrapper-bg">
      <Container>
        <div className="deals-section rounded">
          <Row className="g-0">
            <Col
              xs={12}
              md={4}
              className="p-3 p-lg-4 deals-timer-section d-flex flex-row flex-md-column justify-content-between justify-content-md-start align-items-center align-items-md-start"
            >
              <div>
                <h4 className="fw-bold mb-1 deals-title">Deals and offers</h4>
                <p className="mb-0 mb-md-4 deals-subtitle">
                  get the best discounts!
                </p>
              </div>
              <CountdownTimer targetDate={endDate} />
            </Col>

            <Col xs={12} md={8} className="overflow-hidden">
              {!isMobile ? (
                <Row className="g-0 h-100 deals-products-row justify-content-center">
                  {dealsData.map((product) => (
                    <Col md={4} lg={3} key={product.id}>
                      <ProductCard
                        id={product.id}
                        image={product.image}
                        title={product.name || product.title}
                        price={product.price}
                        discount={product.discount || "-25%"}
                      />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="mobile-deals-swiper-container">
                  <Swiper
                    slidesPerView={2.4}
                    spaceBetween={0}
                    className="mobile-deals-swiper"
                  >
                    {dealsData.map((product) => (
                      <SwiperSlide
                        key={product.id}
                        className="swiper-slide-auto"
                      >
                        <ProductCard
                          id={product.id}
                          image={product.image}
                          title={product.name || product.title}
                          price={product.price}
                          discount={product.discount || "-25%"}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
}
