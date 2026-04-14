import { NavLink } from "react-router";
import { FaChartPie, FaBox, FaTags, FaHome } from "react-icons/fa";

export default function AdminSidebar() {
  return (
    <div className="admin-sidebar border-end border-secondary border-opacity-10">
      <div className="p-4 text-center border-bottom border-secondary border-opacity-10">
        <h4 className="fw-bold text-main-theme m-0">Admin Panel</h4>
      </div>

      <div className="d-flex flex-column p-3 gap-2 mt-3">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <FaChartPie /> Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <FaBox /> Products
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? "active" : ""}`
          }
        >
          <FaTags /> Categories
        </NavLink>
      </div>

      <div className="mt-auto p-3 border-top border-secondary border-opacity-10">
        <NavLink to="/" className="admin-nav-link text-muted">
          <FaHome /> Back to Shop
        </NavLink>
      </div>
    </div>
  );
}
