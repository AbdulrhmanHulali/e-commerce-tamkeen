import { useContext } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "../../Contexts/AppContext";

export default function RelatedProducts({ relatedItems }) {
  const navigate = useNavigate();
  const items = relatedItems;
  const { formatPrice } = useContext(AppContext);

  if (!items || items.length === 0) return null;

  return (
    <div className="related-products-card shadow-sm ">
      <h6 className="fw-bold mb-3 text-main-theme">You may like</h6>
      {items.map((item) => (
        <div
          key={item.id}
          className="related-product-item"
          onClick={() => {
            navigate(`/product/${item.id}`);
            window.scrollTo(0, 0);
          }}
        >
          <div className="related-img-wrapper">
            <img src={item.image} alt={item.name || item.title} className="related-img" />
          </div>
          <div className="related-info">
            <h6 className="text-main-theme text-truncate">{item.name || item.title}</h6>
            <div className="price">{formatPrice(item.price)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}