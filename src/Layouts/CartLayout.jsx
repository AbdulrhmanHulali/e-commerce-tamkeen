import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router";
import LoginModal from "../Components/LoginModal";

export default function CartLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar showSubNav={false} showSearch={false} />

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <Footer />
      <LoginModal />
    </div>
  );
}
