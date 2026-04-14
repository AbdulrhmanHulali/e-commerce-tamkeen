import { Outlet } from "react-router";
import AdminSidebar from "../Components/Admin/AdminSidebar";
import "../styles/adminLayout.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout-wrapper bg-input-theme">
      <AdminSidebar />
      <div className="admin-main-content">
        <div className="p-4 p-md-5">
          <Outlet /> 
        </div>
      </div>
    </div>
  );
}