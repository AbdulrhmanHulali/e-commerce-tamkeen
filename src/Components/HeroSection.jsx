import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import "../styles/heroSection.css";
import { AppContext } from "../Contexts/AppContext";
import { api_config } from "../../Config/API"; 
import fallbackImage from "../assets/images/latest-trending.png";

export default function HeroSection() {
  const [heroData, setHeroData] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const navigate = useNavigate();
  const [isLg, setIsLg] = useState(window.innerWidth >= 992);
  const [isMd, setIsMd] = useState(window.innerWidth >= 768);

  const { isAuthenticated, user, setShowLoginModal, lang } =
    useContext(AppContext);

  useEffect(() => {
    const handleResize = () => {
      setIsLg(window.innerWidth >= 992);
      setIsMd(window.innerWidth >= 768);
    };

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
      .then((result) => {
        if (result.code === 1 && result.data && result.data.length > 0) {
          const categories = result.data.slice(0, 6);
          setHeroData(categories);
          setActiveTab(categories[0]);
        }
      })
      .catch((err) => console.error("Error fetching hero data:", err));
  }, [lang]);

  const handleNavigate = () => {
    if (activeTab) {
      navigate(`/category/${activeTab.id}`);
    }
  };

  if (!heroData.length || !activeTab) return null;
  const handleScrollToQuote = () => {
    const element = document.getElementById("quote-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Container className="pt-4">
      <div className="hero-wrapper p-3 rounded-3">
        <Row className="g-3">
          {isLg && (
            <Col lg={2}>
              <ListGroup variant="flush" className="hero-categories">
                {heroData.map((item) => (
                  <ListGroup.Item
                    key={item.id}
                    action
                    active={activeTab.id === item.id}
                    onClick={() => setActiveTab(item)}
                    className={`border-0 rounded-2 py-2 px-3`}
                  >
                    {item.name}
                  </ListGroup.Item>
                ))}
                <ListGroup.Item
                  action
                  className="border-0 rounded-2 py-2 px-3 fw-bold mt-2 more-category-link"
                  onClick={() => navigate("/all-categories")}
                >
                  More category
                </ListGroup.Item>
              </ListGroup>
            </Col>
          )}

          <Col lg={7} md={8} xs={12}>
            <div
              className="hero-banner p-5 h-100 rounded-3 text-start d-flex flex-column justify-content-center"
              style={{
                backgroundImage: `url(${activeTab.image || fallbackImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <h5 className="mb-1">Explore Category</h5>
              <h2 className="fw-bold mb-4 text-capitalize">{activeTab.name}</h2>
              <div className="d-flex gap-3 mt-2">
                <Button
                  variant="primary"
                  className="hero-learn-btn fw-bold px-4 py-2 shadow-sm"
                  onClick={() =>
                    navigate(`/products`)
                  }
                >
                  All Products
                </Button>
                <Button
                  variant="light"
                  className="hero-learn-btn fw-bold px-4 py-2 shadow-sm"
                  onClick={handleNavigate}
                >
                  Learn more
                </Button>
              </div>
            </div>
          </Col>

          {isMd && (
            <Col lg={3} md={4}>
              <div className="d-flex flex-column gap-2 h-100">
                <div className="user-card p-3 rounded-3 shadow-sm">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <FaUserCircle
                      size={40}
                      className="text-secondary opacity-50"
                    />
                    <span className="text-start">
                      {isAuthenticated ? (
                        <>
                          Hi, {user?.name} <br /> Welcome!
                        </>
                      ) : (
                        <>
                          Hi, user <br /> let's get started
                        </>
                      )}
                    </span>
                  </div>
                  {!isAuthenticated && (
                    <>
                      <Button
                        variant="primary"
                        className="w-100 mb-2 py-1 fw-bold"
                        onClick={() => setShowLoginModal(true)}
                      >
                        Join now
                      </Button>
                      <Button
                        variant="light"
                        className="w-100 py-1 fw-bold text-primary"
                        onClick={() => setShowLoginModal(true)}
                      >
                        Log in
                      </Button>
                    </>
                  )}
                </div>

                <div className="promo-card orange p-3 rounded-3 text-white text-start">
                  24/7 Support <br /> for all your <br /> inquiries
                </div>
                <div
                  className="promo-card teal p-3 rounded-3 text-white text-start"
                  onClick={handleScrollToQuote}
                >
                  Send quotes with <br /> supplier <br /> preferences
                </div>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </Container>
  );
}
