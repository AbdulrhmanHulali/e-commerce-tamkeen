import { useNavigate } from "react-router";
import { useContext } from "react";
import { AppContext } from "../../Contexts/AppContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function RelatedProductsHorizontal({ products }) {
  const navigate = useNavigate();

  const { addToFavorites, removeFromFavorites, isFavorite, formatPrice } =
    useContext(AppContext);

  if (!products || products.length === 0) return null;

  const handleFav = (e, item, isFav) => {
    e.stopPropagation();
    e.preventDefault();
    if (isFav) {
      removeFromFavorites(item.id);
    } else {
      addToFavorites(item.id);
    }
  };

  return (
    <div className="bottom-related-wrapper p-4 shadow-sm ">
      <h5 className="fw-bold mb-4 text-main-theme">Related products</h5>
      <div className="row g-3">
        {products.map((item, idx) => {
          const isFav = isFavorite(item.id);

          return (
            <div className="col-6 col-md-4 col-lg-2" key={idx}>
              <div
                className="bottom-related-card position-relative h-100 cursor-pointer"
                onClick={() => {
                  navigate(`/product/${item.id}`);
                  window.scrollTo(0, 0);
                }}
              >
                <button
                  className="related-fav-btn position-absolute"
                  onClick={(e) => handleFav(e, item, isFav)}
                  title={isFav ? "Saved in Favorites" : "Add to Favorites"}
                >
                  {isFav ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                </button>

                <div className="bottom-related-img-box mb-3 position-relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name || item.title}
                    className="bottom-related-img"
                  />
                </div>
                <h6 className="text-main-theme bottom-related-title">
                  {item.name || item.title}
                </h6>
                <div className="text-muted-theme bottom-related-price">
                  {formatPrice(item.price)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}