import { useState, useEffect, useContext } from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router";
import "swiper/css";
import CategoryItemCard from "./CategoryItemCard";
import "../styles/categorySection.css";
import { AppContext } from "../Contexts/AppContext";
import { api_config } from "../../Config/API"; 

import fallbackBanner1 from "../assets/images/home-and-outdoor.png";
import fallbackBanner2 from "../assets/images/consumer.png";
import fallbackProductImage from "../assets/images/Laptop.png";

export default function CategorySection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { lang } = useContext(AppContext);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.GET_ALL_CATEGORIES}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": lang,
      },
    })
      .then((res) => res.json())
      .then(async (result) => {
        if (result.code === 1) {
          const topTwo = (result.data || []).slice(0, 2);

          const detailedCategories = await Promise.all(
            topTwo.map(async (cat) => {
              try {
                const detailRes = await fetch(
                  `${api_config.BASE_URL}${api_config.ENDPOINTS.GET_CATEGORY_DETAILS}${cat.id}`,
                  {
                    method: "GET",
                    headers: {
                      Accept: "application/json",
                      "Accept-Language": lang,
                    },
                  },
                );
                const detailData = await detailRes.json();

                if (detailData.code === 1) {
                  return { ...cat, subItems: detailData.data.categories || [] };
                }
                return { ...cat, subItems: [] };
              } catch (error) {
                console.error("Error fetching category details:", error);
                return { ...cat, subItems: [] };
              }
            }),
          );

          setCategories(detailedCategories);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err))
      .finally(() => setIsLoading(false));
  }, [lang]);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  if (categories.length === 0) return null;

  const fallbackBanners = [fallbackBanner1, fallbackBanner2];

  return (
    <>
      {categories.map((cat, catIndex) => {
        const sectionTitle = cat.name;

        const bannerImage = cat.image || fallbackBanners[catIndex % 2];

        const subItems = cat.subItems || [];
        const paddedItems = [...subItems];

        while (paddedItems.length < 8) {
          paddedItems.push({
            isComingSoon: true,
            id: `soon-${cat.id}-${paddedItems.length}`,
            name: "Coming soon",
            price: "",
            image: null,
          });
        }

        return (
          <div className="category-wrapper mb-3" key={cat.id}>
            {!isMobile ? (
              <div className="h-100">
                <Row className="g-0 h-100">
                  <Col
                    xs={12}
                    md={4}
                    lg={3}
                    className="banner-col bg-light"
                    style={{ backgroundImage: `url(${bannerImage})` }}
                  >
                    <div className="p-4 d-flex flex-column align-items-start justify-content-start h-100">
                      <h4 className="fw-bold mb-3 text-start banner-title text-dark">
                        {sectionTitle}
                      </h4>
                      <Button
                        as={Link}
                        to={`/category/${cat.id}`}
                        variant="light"
                        className="fw-bold px-4 rounded-3 shadow-sm text-dark text-decoration-none"
                      >
                       Source now
                      </Button>
                    </div>
                  </Col>

                  <Col xs={12} md={8} lg={9} className="products-col">
                    <Row className="g-0 h-100">
                      {paddedItems.map((item, index) => {
                        const isLastRow = index >= 4;
                        const displayImage = item.image
                          ? item.image
                          : fallbackProductImage;
                        return (
                          <Col xs={6} md={3} key={item.id || index}>
                            <Link
                              to={`/category/${item.id}`}
                              className={`d-block text-decoration-none h-100 ${isLastRow ? "remove-bottom-border-md" : ""} ${
                                item.isComingSoon ? "opacity-50" : ""
                              }`}
                              style={{
                                pointerEvents: item.isComingSoon
                                  ? "none"
                                  : "auto",
                              }}
                            >
                              <CategoryItemCard
                                title={item.name || item.title}
                                price={item.price || ""}
                                image={displayImage}
                              />
                            </Link>
                          </Col>
                        );
                      })}
                    </Row>
                  </Col>
                </Row>
              </div>
            ) : (
              <div className="mobile-category-section">
                <h5 className="p-3 mb-0 fw-bold mobile-category-title">
                  {sectionTitle}
                </h5>
                <Swiper
                  slidesPerView={2.4}
                  spaceBetween={0}
                  className="mobile-category-swiper border-bottom"
                >
                  {paddedItems.map((item, index) => {
                    const displayImage = item.image
                      ? item.image
                      : fallbackProductImage;
                    return (
                      <SwiperSlide
                        key={item.id || index}
                        className="swiper-slide-auto"
                      >
                        <div
                          style={{
                            pointerEvents: item.isComingSoon ? "none" : "auto",
                          }}
                          className={item.isComingSoon ? "opacity-50" : ""}
                        >
                          <CategoryItemCard
                            title={item.name || item.title}
                            price={item.price || ""}
                            image={displayImage}
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
                <div className="p-3 text-start">
                  <Link
                    to={`/category/${cat.id}`}
                    className="mobile-source-link fw-bold text-decoration-none"
                  >
                    Source now{" "}
                    <span className="fs-5 align-middle">&rarr;</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
