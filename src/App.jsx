import { useEffect, useContext } from "react";
import { Routes, Route, useLocation } from "react-router";
import ThemeToggle from "./Components/ThemeToggle";
import MainLayout from "./Layouts/MainLayout";
import MinimalLayout from "./Layouts/MinimalLayout";
import CartLayout from "./Layouts/CartLayout";
import HomePage from "./Pages/HomePage";
import ProductsPage from "./Pages/ProductsPage.jsx";
import ProductDetailsPage from "./Pages/ProductDetailsPage";
import CartPage from "./Pages/CartPage";
import ProfilePage from "./Pages/ProfilePage";
import ContactUsPage from "./Pages/ContactUsPage";
import TermsPage from "./Pages/TermsPage";
import CheckoutPage from "./Pages/CheckoutPage";
import AllCategoriesPage from "./Pages/AllCategoriesPage";
import AboutUsPage from "./Pages/AboutUsPage";
import FaqPage from "./Pages/FaqPage";
import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage";
import MyOrdersPage from "./Pages/MyOrdersPage";
import OrderDetailsPage from "./Pages/OrderDetailsPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import VerifyOTPPage from "./Pages/VerifyOTPPage";
import FavoritesPage from "./Pages/FavoritesPage";
import SupplierProfilePage from "./Pages/SupplierProfilePage";
import CategoryDetailsPage from "./Pages/CategoryDetailsPage";
import AdminLayout from "./Layouts/AdminLayout";
import AdminDashboard from "./Pages/AdminDashboard";
import ManageProducts from "./Pages/ManageProducts";
import ManageCategories from "./Pages/ManageCategories.jsx";
import { AppContext } from "./Contexts/AppContext";

function App() {
  const { pathname } = useLocation();
  const { lang } = useContext(AppContext);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <>
      <ThemeToggle />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={<CategoryDetailsPage />} />
          <Route path="/products" element={<ProductsPage />} />{" "}
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/all-categories" element={<AllCategoriesPage />} />
          <Route path="/supplier-profile" element={<SupplierProfilePage />} />
        </Route>

        <Route element={<MinimalLayout />}>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AboutUsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <FaqPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy"
            element={
              <ProtectedRoute>
                <PrivacyPolicyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<CartLayout />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<FavoritesPage />} />
        </Route>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyOTPPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="categories" element={<ManageCategories />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
