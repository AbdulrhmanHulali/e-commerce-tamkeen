import { useContext, useEffect } from "react";
import { Navigate } from "react-router";
import { AppContext } from "../Contexts/AppContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, setShowLoginModal } = useContext(AppContext);

  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isAuthenticated, setShowLoginModal]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
