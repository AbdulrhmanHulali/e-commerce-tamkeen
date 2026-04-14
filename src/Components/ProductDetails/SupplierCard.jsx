import { Button } from "react-bootstrap";
import {
  FaShieldAlt,
  FaGlobe,
  FaHeart,
  FaRegHeart,
  FaChevronRight,
} from "react-icons/fa";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../Contexts/AppContext";
import { useNavigate } from "react-router";

export default function SupplierCard({ product, supplier, selectedVariant }) {
  const { addToCart, addToFavorites, isFavorite, removeFromFavorites } = useContext(AppContext);
  const isFav = product ? isFavorite(product?.id) : false;

  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAddToCart = () => {
    const priceText = selectedVariant?.price || product?.priceTiers?.[0]?.price || product?.price || "0";
    const cleanPrice = parseFloat(priceText.toString().replace(/[^0-9.]/g, "")) || 0;

    const productToAdd = {
      id: product?.id || Math.random().toString(),
      variant_id: selectedVariant?.id || null, 
      title: product?.title || "Product item",
      price: cleanPrice,
      image: selectedVariant?.image || product?.images?.[0] || product?.image || "/src/assets/images/smartwatch.png",
      quantity: 1,
      seller: supplier?.name || "Verified Supplier",
      details: product?.details?.Type || "Standard version",
    };

    addToCart(productToAdd);
  };

  return (
    <div
      className={
        isMobile
          ? "mobile-supplier-card text-start"
          : "supplier-card-box text-start"
      }
    >
      {isMobile ? (
        <div
          className="d-flex justify-content-between align-items-center w-100 mobile-supplier-header"
          onClick={() => navigate("/supplier-profile")}
        >
          <div className="d-flex align-items-center gap-2">
            <div className="supplier-avatar">{supplier?.initial}</div>
            <div>
              <div className="supplier-label">Supplier</div>
              <h5 className="supplier-name-title m-0">{supplier?.name}</h5>
            </div>
          </div>
          <FaChevronRight className="text-muted-theme mobile-chevron-icon" />
        </div>
      ) : (
        <div className="supplier-header">
          <div className="supplier-avatar">{supplier?.initial}</div>
          <div>
            <div className="supplier-label">Supplier</div>
            <h5 className="supplier-name-title">{supplier?.name}</h5>
          </div>
        </div>
      )}

      <ul
        className={`supplier-info-list ${isMobile ? "mobile-supplier-list m-0" : ""}`}
      >
        <li className="supplier-info-item">
          <img src={supplier?.flag} alt="flag" className="supplier-flag" />
          {supplier?.location}
        </li>
        <li className="supplier-info-item">
          <FaShieldAlt className="text-muted-theme" />
          {supplier?.isVerified ? "Verified Seller" : "Seller"}
        </li>
        <li className="supplier-info-item">
          <FaGlobe className="text-muted-theme" />
          {supplier?.shipping}
        </li>
      </ul>

      {!isMobile && (
        <div className="mt-4">
          <Button
            variant="primary"
            className="btn-inquiry shadow-none mb-2 w-100"
            onClick={handleAddToCart}
            disabled={(!selectedVariant && (product?.colors?.length > 0 || product?.attributes?.length > 0))}
          >
            Send inquiry
          </Button>

          <Button
            className="btn-fav-pink shadow-none d-flex align-items-center justify-content-center gap-2 w-100"
            onClick={() => {
               if (isFav) {
                removeFromFavorites(product.id);
              } else {
                addToFavorites(product.id); 
              }
            }}
          >
            {isFav ? <FaHeart /> : <FaRegHeart />}
            <span>{isFav ? "Saved to Favorites" : "Add to Favorites"}</span>
          </Button>
        </div>
      )}
    </div>
  );
}