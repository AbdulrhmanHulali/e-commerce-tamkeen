import { useState, useContext, useEffect } from "react";
import {
  Container,
  Form,
  InputGroup,
  Button,
  Navbar as BootNavbar,
  Nav,
  Offcanvas,
  CloseButton,
  ListGroup,
  Dropdown,
} from "react-bootstrap";
import {
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaBars,
  FaMoon,
  FaSun,
  FaArrowLeft,
  FaBox,
  FaHome,
  FaList,
  FaBoxOpen,
  FaGlobe,
  FaHeadset,
  FaInfoCircle,
  FaSignOutAlt,
  FaCoins,
  FaBell,
} from "react-icons/fa";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { api_config } from "../../Config/API"; 
import { AppContext } from "../Contexts/AppContext";
import logo from "../assets/images/logo.svg";
import "./navbar.css";

function SubNavbar() {
  const [activeCategory, setActiveCategory] = useState("All category");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const { currency, setCurrency, lang } = useContext(AppContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCategories = () => {
      fetch(`${api_config.BASE_URL}/category`, {
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
        .catch((err) =>
          console.error("Error fetching categories in SubNav:", err),
        );
    };

    fetchCategories();
  }, [lang]);

  const topCategories = categories.slice(0, 4);

  const handleCategoryClick = (catName, catId) => {
    if (catName === "All category") {
      navigate("/all-categories");
    } else {
      navigate(`/category/${catId}`);
    }
  };

  return (
    <div className="sub-nav py-2 border-top">
      <Container className="d-flex justify-content-between align-items-center">
        {!isMobile ? (
          <>
            <Nav className="gap-4 align-items-center fw-medium">
              <Nav.Link
                className={`p-0 d-flex align-items-center cursor-pointer ${
                  activeCategory === "All category"
                    ? "fw-bold main-link"
                    : "sub-link"
                }`}
                onClick={() => {
                  handleCategoryClick("All category");
                  setActiveCategory("All category");
                }}
              >
                <FaBars className="me-2" /> All category
              </Nav.Link>
              {topCategories.map((cat) => (
                <Nav.Link
                  key={cat.id}
                  className={`p-0 text-capitalize ${activeCategory === cat.name ? "fw-bold main-link" : "sub-link"}`}
                  onClick={() => {
                    handleCategoryClick(cat.name, cat.id);
                    setActiveCategory(cat.name);
                  }}
                >
                  {cat.name}
                </Nav.Link>
              ))}
              <Dropdown>
                <Dropdown.Toggle
                  variant="transparent"
                  className="p-0 border-0 shadow-none sub-link text-decoration-none d-flex align-items-center"
                >
                  Help
                </Dropdown.Toggle>
                <Dropdown.Menu className="custom-dropdown-menu shadow-sm border-0 mt-3">
                  <Dropdown.Item
                    className="custom-dropdown-item"
                    onClick={() => navigate("/faq")}
                  >
                    FAQ
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="custom-dropdown-item"
                    onClick={() => navigate("/contact-us")}
                  >
                    Contact Us
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="custom-dropdown-item"
                    onClick={() => navigate("/about")}
                  >
                    About Us
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    className="custom-dropdown-item"
                    onClick={() => navigate("/terms")}
                  >
                    Terms & Conditions
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="custom-dropdown-item"
                    onClick={() => navigate("/privacy")}
                  >
                    Privacy Policy
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
            <div className="ms-4">
              <Dropdown>
                <Dropdown.Toggle
                  variant="transparent"
                  className="lang-currency fw-medium p-0 border-0 shadow-none d-flex align-items-center gap-2 text-decoration-none"
                >
                  <FaCoins className=" mb-1" size={16} /> {currency}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className="custom-dropdown-menu shadow-sm border-0 mt-3"
                  align="end"
                >
                  <Dropdown.Header className="fw-bold custom-dropdown-header">
                    Currency
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    className="custom-dropdown-item"
                    active={currency === "USD"}
                    onClick={() => setCurrency("USD")}
                  >
                    USD - US Dollar
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="custom-dropdown-item"
                    active={currency === "EUR"}
                    onClick={() => setCurrency("EUR")}
                  >
                    EUR - Euro
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="custom-dropdown-item"
                    active={currency === "AED"}
                    onClick={() => setCurrency("AED")}
                  >
                    AED - UAE Dirham
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="custom-dropdown-item"
                    active={currency === "SAR"}
                    onClick={() => setCurrency("SAR")}
                  >
                    SAR - Saudi Riyal
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="custom-dropdown-item"
                    active={currency === "SYP"}
                    onClick={() => setCurrency("SYP")}
                  >
                    SYP - Syrian Pound
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </>
        ) : (
          <div className="w-100 overflow-hidden">
            <Swiper
              slidesPerView="auto"
              spaceBetween={8}
              className="mobile-nav-swiper"
            >
              <SwiperSlide className="swiper-slide-auto">
                <div
                  className={`mobile-nav-chip cursor-pointer ${activeCategory === "All category" ? "active" : ""}`}
                  onClick={() => {
                    handleCategoryClick("All category");
                    setActiveCategory("All category");
                  }}
                >
                  <FaBars className="me-1 d-inline" /> All
                </div>
              </SwiperSlide>
              {categories.map((cat) => (
                <SwiperSlide key={cat.id} className="swiper-slide-auto">
                  <div
                    className={`mobile-nav-chip text-capitalize cursor-pointer ${activeCategory === cat.name ? "active" : ""}`}
                    onClick={() => {
                      handleCategoryClick(cat.name, cat.id);
                      setActiveCategory(cat.name);
                    }}
                  >
                    {cat.name}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </Container>
    </div>
  );
}

function CartOffcanvas({ show, onHide }) {
  const {
    cartItems,
    cartTotalItems,
    removeFromCart,
    updateQuantity,
    theme,

    formatPrice,
    lang,
  } = useContext(AppContext);
  const cartTotalPrice = cartItems
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement={lang === "ar" ? "start" : "end"}
      className="cart-offcanvas shadow-lg bg-main-theme text-main-theme border-0"
    >
      <Offcanvas.Header className="border-bottom border-secondary border-opacity-25 py-3 d-flex justify-content-between align-items-center">
        <Offcanvas.Title className="fw-bold m-0 fs-5 text-main-theme">
          My Cart ({cartTotalItems})
        </Offcanvas.Title>
        <CloseButton
          variant={theme === "dark" ? "white" : undefined}
          onClick={onHide}
        />
      </Offcanvas.Header>
      <Offcanvas.Body className="p-0 d-flex flex-column">
        {cartItems.length === 0 ? (
          <div className="text-center text-muted m-auto py-5">
            <FaShoppingCart size={60} className="mb-3 opacity-25" />
            <p className="mb-0 fs-5">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="cart-offcanvas-body custom-scrollbar p-3 flex-grow-1 overflow-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="cart-mini-item d-flex gap-3 mb-3 pb-3 border-bottom border-secondary border-opacity-25"
                >
                  <div className="cart-mini-img-box border border-secondary border-opacity-25 rounded p-1 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-100 h-100 object-fit-contain"
                    />
                  </div>
                  <div className="flex-grow-1 d-flex flex-column justify-content-between">
                    <div>
                      <h6 className="mb-1 fw-bold cart-item-title text-main-theme">
                        {item.title}
                      </h6>
                      {/* استدعاء تابع السعر */}
                      <div className="text-muted mb-2 small">
                        Item Price: {formatPrice(item.price)}
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      {/* استدعاء تابع السعر لحساب سعر الكمية */}
                      <span className="fw-bold fs-6 text-main-theme">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center border border-secondary border-opacity-25 rounded">
                          <button
                            className="btn btn-sm px-2 py-0 shadow-none text-main-theme bg-transparent border-0"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-2 small fw-medium text-main-theme">
                            {item.quantity}
                          </span>
                          <button
                            className="btn btn-sm px-2 py-0 shadow-none text-main-theme bg-transparent border-0"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="btn p-0 text-danger shadow-none fw-medium small"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-top border-secondary border-opacity-25 mt-auto shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted fw-medium fs-5">Subtotal:</span>

                {/* كمان استدعاء تابع السعر حسب العملة */}
                <span className="fw-bold fs-3 text-main-theme">
                  {formatPrice(cartTotalPrice)}
                </span>
              </div>
              <div className="d-flex flex-column gap-2">
                <Link
                  to="/cart"
                  onClick={onHide}
                  className="btn btn-accent w-100 py-2 fw-bold shadow-none border-0 fs-5 text-white"
                >
                  View Cart
                </Link>
              </div>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

function MobileMenu({ show, onHide }) {
  const { isAuthenticated, theme, lang, currency, setCurrency } =
    useContext(AppContext);
  const navigate = useNavigate();

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement={lang === "ar" ? "end" : "start"}
      className="mobile-offcanvas shadow-lg bg-main-theme text-main-theme border-0"
    >
      <Offcanvas.Header className="pb-4 pt-4 border-bottom border-secondary border-opacity-25 bg-light-theme d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <div className="text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm offcanvas-avatar">
            <FaUser size={22} color="#fff" />
          </div>
          <div className="d-flex gap-1 fw-bold fs-6 mt-1">
            {!isAuthenticated ? (
              <>
                <span
                  className="cursor-pointer auth-link text-main-theme"
                  onClick={() => {
                    onHide();
                    navigate("/login");
                  }}
                >
                  Sign in
                </span>
                <span className="auth-separator text-main-theme"> | </span>
                <span
                  className="cursor-pointer auth-link text-main-theme"
                  onClick={() => {
                    onHide();
                    navigate("/register");
                  }}
                >
                  Register
                </span>
              </>
            ) : (
              <span
                className="cursor-pointer auth-link text-danger"
                onClick={() => {
                  onHide();
                }}
              >
                <FaSignOutAlt className="me-1" /> Logout
              </span>
            )}
          </div>
        </div>
        <CloseButton
          variant={theme === "dark" ? "white" : undefined}
          onClick={onHide}
        />
      </Offcanvas.Header>
      <Offcanvas.Body className="p-0 bg-main-theme">
        <ListGroup variant="flush" className="mobile-menu-list">
          <ListGroup.Item
            action
            className="py-3 px-4 border-0 d-flex align-items-center gap-3 bg-transparent text-main-theme cursor-pointer"
            onClick={() => {
              onHide();
              navigate("/");
            }}
          >
            <FaHome className="text-muted icon-small" /> Home
          </ListGroup.Item>

          <ListGroup.Item
            action
            className="py-3 px-4 border-0 d-flex align-items-center gap-3 bg-transparent text-main-theme cursor-pointer"
            onClick={() => {
              onHide();
              navigate("/all-categories");
            }}
          >
            <FaList className="text-muted icon-small" /> Categories
          </ListGroup.Item>

          <ListGroup.Item
            action
            className="py-3 px-4 border-0 d-flex align-items-center gap-3 bg-transparent text-main-theme cursor-pointer"
            onClick={() => {
              onHide();
              navigate("/wishlist");
            }}
          >
            <FaHeart className="text-muted icon-small" /> Favorites
          </ListGroup.Item>

          <ListGroup.Item
            action
            className="py-3 px-4 border-0 d-flex align-items-center gap-3 bg-transparent text-main-theme cursor-pointer"
            onClick={() => {
              onHide();
              navigate("/orders");
            }}
          >
            <FaBoxOpen className="text-muted icon-small" /> My orders
          </ListGroup.Item>

          <hr className="my-1 text-secondary opacity-25 mx-3" />
          <ListGroup.Item className="p-0 border-0 bg-transparent">
            <Dropdown className="w-100">
              <Dropdown.Toggle
                variant="transparent"
                className="py-3 px-4 border-0 d-flex align-items-center gap-3 bg-transparent text-main-theme w-100 text-start shadow-none rounded-0"
              >
                <FaGlobe className="text-muted icon-small" /> {currency}{" "}
                (Currency)
              </Dropdown.Toggle>

              <Dropdown.Menu className="border-0 shadow-sm w-100 custom-dropdown-menu mobile-currency-dropdown">
                <Dropdown.Item
                  className="custom-dropdown-item py-2"
                  active={currency === "USD"}
                  onClick={() => {
                    setCurrency("USD");
                    onHide();
                  }}
                >
                  USD - US Dollar
                </Dropdown.Item>
                <Dropdown.Item
                  className="custom-dropdown-item py-2"
                  active={currency === "EUR"}
                  onClick={() => {
                    setCurrency("EUR");
                    onHide();
                  }}
                >
                  EUR - Euro
                </Dropdown.Item>
                <Dropdown.Item
                  className="custom-dropdown-item py-2"
                  active={currency === "AED"}
                  onClick={() => {
                    setCurrency("AED");
                    onHide();
                  }}
                >
                  AED - UAE Dirham
                </Dropdown.Item>
                <Dropdown.Item
                  className="custom-dropdown-item py-2"
                  active={currency === "SAR"}
                  onClick={() => {
                    setCurrency("SAR");
                    onHide();
                  }}
                >
                  SAR - Saudi Riyal
                </Dropdown.Item>
                <Dropdown.Item
                  className="custom-dropdown-item py-2"
                  active={currency === "SYP"}
                  onClick={() => {
                    setCurrency("SYP");
                    onHide();
                  }}
                >
                  SYP - Syrian Pound
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ListGroup.Item>
          <ListGroup.Item
            action
            className="py-3 px-4 border-0 d-flex align-items-center gap-3 bg-transparent text-main-theme cursor-pointer"
            onClick={() => {
              onHide();
              navigate("/contact-us");
            }}
          >
            <FaHeadset className="text-muted icon-small" /> Contact us
          </ListGroup.Item>

          <ListGroup.Item
            action
            className="py-3 px-4 border-0 d-flex align-items-center gap-3 bg-transparent text-main-theme cursor-pointer"
            onClick={() => {
              onHide();
              navigate("/about");
            }}
          >
            <FaInfoCircle className="text-muted icon-small" /> About
          </ListGroup.Item>
        </ListGroup>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default function Navbar({ showSubNav = true, showSearch = true }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(searchParams.get("category_id") || "all");
  const [searchCategories, setSearchCategories] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    theme,
    setTheme,
    lang,
    setLang,
    cartTotalItems,
    isAuthenticated,
    setShowLoginModal,
    setShowNotifModal,
    notifications,
  } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

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
        if (result.code === 1) {
          setSearchCategories(result.data || []);
        }
      })
      .catch((err) => console.error("Error fetching search categories:", err));
  }, [lang]);

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // منع إعادة تحميل الصفحة الافتراضي
    const params = new URLSearchParams();
    
    if (searchTerm.trim() !== "") {
      params.set("search", searchTerm.trim());
    }
    if (selectedCategoryId !== "all") {
      params.set("category_id", selectedCategoryId);
    }
    
    // توجيه المستخدم لصفحة المنتجات مع تمرير الفلاتر
    // ملاحظة: تأكدي أن مسار صفحة المنتجات لديك هو /products أو /all-categories وعدليه هنا إذا لزم الأمر
    navigate(`/products?${params.toString()}`); 
  };



  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  const getMobilePageTitle = () => {
    if (location.pathname.includes("/product")) return "Product Details";
    if (location.pathname.includes("/category")) return "Category";
    if (location.pathname.includes("/all-categories")) return "All Categories";
    return "Back";
  };

  return (
    <header className="main-header border-bottom">
      <BootNavbar className="py-2 py-lg-3">
        <Container className="align-items-center justify-content-between">
          <div className="d-flex align-items-center overflow-hidden navbar-brand-wrapper">
            {isMobile &&
              (isHomePage ? (
                <FaBars
                  className="me-3 fs-4 cursor-pointer mobile-menu-icon"
                  onClick={() => setShowMenu(true)}
                />
              ) : (
                <FaArrowLeft
                  className=" me-3 fs-4 cursor-pointer mobile-menu-icon flex-shrink-0"
                  style={{
                    transform: lang === "ar" ? "rotate(180deg)" : "none",
                  }}
                  onClick={() => navigate(-1)}
                />
              ))}
            {!isMobile || isHomePage ? (
              <BootNavbar.Brand
                as={Link}
                to="/"
                className="fw-bold d-flex align-items-center brand-logo m-0"
              >
                <img src={logo} alt="Site Logo" className="navbar-logo" />
              </BootNavbar.Brand>
            ) : (
              <div className="d-flex align-items-center ms-2 text-truncate">
                <span className="fw-bold text-main-theme text-truncate mobile-page-title">
                  {getMobilePageTitle()}
                </span>
              </div>
            )}
          </div>
          {showSearch && !isMobile && (
            <div className="search-wrapper flex-grow-1 mx-4 search-container desktop-search-container">
              {/* ربطنا الفورم بدالة البحث */}
              <Form onSubmit={handleSearchSubmit}> 
                <InputGroup className="custom-search-group">
                  <Form.Control
                    type="search"
                    placeholder="Search products..."
                    className="shadow-none custom-search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="shadow-none custom-search-select text-capitalize"
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                  >
                    <option value="all">All category</option>
                    {searchCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="primary"
                    type="submit" // غيرنا النوع إلى submit
                    className="px-4 fw-bold custom-search-btn"
                  >
                    Search
                  </Button>
                </InputGroup>
              </Form>
            </div>
          )}
          <Nav className="flex-row gap-3 gap-lg-4 nav-icons align-items-center">
            {!isMobile &&
              (!isAuthenticated ? (
                <Nav.Link
                  className="d-flex flex-column align-items-center p-0 text-decoration-none cursor-pointer"
                  onClick={() => setShowLoginModal(true)}
                >
                  <FaUser className="mb-1 icon-size" /> <span>Sign in</span>
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link
                    as={Link}
                    to="/profile"
                    className="d-flex flex-column align-items-center p-0 text-decoration-none"
                  >
                    <FaUser className="mb-1 icon-size" /> <span>Profile</span>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/wishlist"
                    className="d-flex flex-column align-items-center p-0 cursor-pointer"
                  >
                    <FaHeart className="mb-1 icon-size" /> <span>Wishlist</span>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/orders"
                    className="d-flex flex-column align-items-center p-0 text-decoration-none"
                  >
                    <FaBox className="mb-1 icon-size" /> <span>Orders</span>
                  </Nav.Link>
                </>
              ))}
            {isAuthenticated && (
              <div
                className="nav-link p-0 flex-column align-items-center cursor-pointer d-flex position-relative"
                onClick={() => setShowNotifModal(true)}
              >
                <div className="position-relative">
                  <FaBell
                    className={!isMobile ? "mb-1 icon-size" : "icon-size"}
                  />

                  {notifications.length > 0 && (
                    <span className="cart-badge bg-danger border border-light p-1"></span>
                  )}
                </div>
                {!isMobile && <span>Notifications</span>}
              </div>
            )}

            {isAuthenticated && (
              <div
                className="nav-link p-0 flex-column align-items-center cursor-pointer custom-cart-toggle d-flex"
                onClick={() => setShowCart(true)}
              >
                <div className="position-relative">
                  <FaShoppingCart
                    className={!isMobile ? "mb-1 icon-size" : "icon-size"}
                  />
                  {cartTotalItems > 0 && (
                    <span className="cart-badge">{cartTotalItems}</span>
                  )}
                </div>
                {!isMobile && <span>My cart</span>}
              </div>
            )}

            {isMobile && (
              <>
                <Nav.Link
                  className="d-flex flex-column align-items-center p-0"
                  onClick={toggleTheme}
                >
                  {theme === "light" ? (
                    <FaMoon className="icon-size" />
                  ) : (
                    <FaSun className="icon-size" />
                  )}
                </Nav.Link>
                <Nav.Link
                  className="d-flex flex-column align-items-center p-0 fw-bold pt-1 mobile-lang-toggle"
                  onClick={toggleLang}
                >
                  {lang === "en" ? "AR" : "EN"}
                </Nav.Link>
                <Nav.Link
                  className="d-flex flex-column align-items-center p-0"
                  onClick={() => {
                    if (isAuthenticated) navigate("/profile");
                    else setShowLoginModal(true);
                  }}
                >
                  <FaUser className="icon-size" />
                </Nav.Link>
              </>
            )}
          </Nav>
        </Container>
      </BootNavbar>
      {showSearch && isMobile && (
        <div className="px-3 pb-3 pt-1 search-container">
          <Form onSubmit={handleSearchSubmit}>
            <InputGroup className="mobile-search-group shadow-sm">
              <InputGroup.Text 
                className="bg-transparent border-0 text-muted ps-3 cursor-pointer" 
                onClick={handleSearchSubmit}
              >
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search products..."
                className="bg-transparent border-0 shadow-none py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Form>
        </div>
      )}

      {showSubNav && <SubNavbar />}
      <CartOffcanvas show={showCart} onHide={() => setShowCart(false)} />
      <MobileMenu show={showMenu} onHide={() => setShowMenu(false)} />
    </header>
  );
}