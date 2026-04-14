import { useState, useEffect, useContext } from "react";
import {
  FaCheck,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCommentDots,
  FaShoppingBasket,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { Button, Spinner } from "react-bootstrap";
import { AppContext } from "../../Contexts/AppContext";
import { api_config } from "../../Config/api"; 

export default function ProductInfo({ product, onVariantChange }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const { addToFavorites, removeFromFavorites,addToCart, isFavorite, formatPrice } =
    useContext(AppContext);
  const isFav = isFavorite(product?.id);

  const [selectedColorId, setSelectedColorId] = useState(null); 
  const [selectedAttributes, setSelectedAttributes] = useState({}); 
  
  const [variantData, setVariantData] = useState(null); 
  const [isVariantLoading, setIsVariantLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let updated = false;
    let newColorId = selectedColorId;
    let newAttributes = { ...selectedAttributes };

    if (product?.colors?.length > 0 && !selectedColorId) {
      newColorId = product.colors[0].id;
      updated = true;
    }

    if (product?.attributes?.length > 0 && Object.keys(selectedAttributes).length === 0) {
      product.attributes.forEach((attr) => {
        if (attr.values && attr.values.length > 0) {
          newAttributes[attr.id] = attr.values[0].id;
        }
      });
      updated = true;
    }

    if (updated) {
      if (newColorId !== selectedColorId) setSelectedColorId(newColorId);
      if (Object.keys(newAttributes).length > 0) setSelectedAttributes(newAttributes);
    }
  }, [product, selectedColorId, selectedAttributes]);

  useEffect(() => {
    const hasColors = product?.colors?.length > 0;
    const hasAttributes = product?.attributes?.length > 0;

    if (hasColors && !selectedColorId) return;
    if (hasAttributes) {
      const allSelected = product.attributes.every((attr) => selectedAttributes[attr.id]);
      if (!allSelected) return;
    }

    if (!hasColors && !hasAttributes) return;

    let isMounted = true;

    const fetchProductVariant = async () => {
      setIsVariantLoading(true);
      const token = localStorage.getItem("user_token");

      const params = new URLSearchParams();
      params.append("with_avatar", 1);
      params.append("product_id", product.id);
      
      if (selectedColorId) {
        params.append("color_id", selectedColorId);
      }

      const attributesKeys = Object.keys(selectedAttributes);
      if (attributesKeys.length > 0) {
        attributesKeys.forEach((attrId, index) => {
          params.append(`attributes[${index}][attribute_id]`, attrId);
          params.append(`attributes[${index}][attribute_value_id]`, selectedAttributes[attrId]);
        });
      }

      const url = `${api_config.BASE_URL}${api_config.ENDPOINTS.PRODUCT_VARIANT}?${params.toString()}`;

      try {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }), 
          },
        });

        if (!res.ok) throw new Error("Failed to fetch variant");
        const result = await res.json();

       if (isMounted) {
          if (result.code === 1 && result.data) {
            setVariantData(result.data); 
            if(onVariantChange) onVariantChange(result.data); 
          } else {
            setVariantData(null); 
            if(onVariantChange) onVariantChange(null); 
          }
        }
      } catch (err) {
        console.error("Error fetching variant:", err);
        if (isMounted) setVariantData(null);
      } finally {
        if (isMounted) setIsVariantLoading(false);
      }
    };

    fetchProductVariant();

    return () => { isMounted = false; };
  }, [selectedColorId, selectedAttributes, product,onVariantChange]);

  const handleAttributeSelect = (attributeId, valueId) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeId]: valueId,
    }));
  };

const handleAddToCart = () => {
    // تجهيز السعر
    const priceText = variantData?.price || product.priceTiers?.find((t) => t.active)?.price || product.priceTiers?.[0]?.price || "0";
    const cleanPrice = parseFloat(priceText.toString().replace(/[^0-9.]/g, "")) || 0;

    // تجهيز كائن المنتج للإرسال للسلة
    const productToAdd = {
      id: product.id,
      variant_id: variantData ? variantData.id : null, // إرفاق الـ variant_id في حال وجوده
      title: product.title,
      price: cleanPrice,
      image: variantData?.image || product.images?.[0] || "",
      quantity: 1, // القيمة الافتراضية
    };

    // استدعاء الدالة من الـ Context
    addToCart(productToAdd);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => {
      const val = i + 1;
      if (val <= rating) return <FaStar key={i} className="text-warning" />;
      if (val - 0.5 === rating)
        return <FaStarHalfAlt key={i} className="text-warning" />;
      return <FaRegStar key={i} className="text-muted-theme" />;
    });
  };

  const renderOptionsUI = () => (
    <div className="product-options-section mt-4 mb-4 pb-3 border-bottom-theme">
      {product?.colors?.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-bold mb-2 text-main-theme">Color:</h6>
          <div className="d-flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColorId(color.id)}
                className={`color-swatch-btn rounded-circle ${selectedColorId === color.id ? 'border-dark shadow border-2' : 'border'}`}
                style={{ backgroundColor: color.hex_code || '#ccc' }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      )}

      {product?.attributes?.map((attr) => (
        <div className="mb-3" key={attr.id}>
          <h6 className="fw-bold mb-2 text-main-theme">{attr.name}:</h6>
          <div className="d-flex flex-wrap gap-2">
            {attr.values.map((val) => {
              const isSelected = selectedAttributes[attr.id] === val.id;
              return (
                <button
                  key={val.id}
                  onClick={() => handleAttributeSelect(attr.id, val.id)}
                  className={`btn btn-sm attribute-btn ${isSelected ? 'btn-dark px-3 fw-bold shadow-sm' : 'btn-outline-secondary px-3'}`}
                >
                  {val.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      
      {isVariantLoading ? (
        <div className="text-muted-theme small mt-3 d-flex align-items-center gap-2">
           <Spinner animation="border" size="sm" /> 
           Checking price...
        </div>
      ) : (!variantData && (selectedColorId || Object.keys(selectedAttributes).length > 0)) ? (
        <div className="text-danger small mt-3 fw-medium">
          This combination is currently out of stock.
        </div>
      ) : null}
    </div>
  );

  if (isMobile) {
    return (
      <div className="text-start">
        <div className="d-flex align-items-center gap-2 flex-wrap mb-2 small text-muted-theme">
          <div className="d-flex align-items-center gap-1">
            {renderStars(product.rating)}
            <span className="text-warning fw-bold ms-1">{product.score}</span>
          </div>
          <span>•</span>
          <div className="d-flex align-items-center gap-1">
            <FaCommentDots /> {product.reviews} reviews
          </div>
          <span>•</span>
          <div className="d-flex align-items-center gap-1">
            <FaShoppingBasket /> {product.sold} sold
          </div>
        </div>

        <h1 className="product-main-title fs-5 fw-bold mb-1">
          {product.title}
        </h1>

        <div className="mobile-price fw-bold text-danger fs-4 mb-3">
          {formatPrice(
            variantData?.price || 
            product.priceTiers?.find((t) => t.active)?.price ||
            product.priceTiers?.[0]?.price ||
            "0"
          )}
        </div>

        {renderOptionsUI()}

        <div className="d-flex gap-2 mb-4">
          <Button
            className="btn-inquiry flex-grow-1 py-2 fw-bold shadow-none m-0 rounded-2 border-0"
            onClick={handleAddToCart}
            disabled={isVariantLoading || (!variantData && (product?.colors?.length > 0 || product?.attributes?.length > 0))}
          >
            Add to Cart
          </Button>

          <Button
            variant="outline-secondary"
            className="px-3 shadow-none d-flex align-items-center justify-content-center rounded-2 fav-mobile-outline"
            onClick={(e) => {
              e.preventDefault();
              if (isFav) {
                removeFromFavorites(product.id);
              } else {
                addToFavorites(product.id); 
              }
            }}
          >
            {isFav ? (
              <FaHeart size={20} className="text-danger" /> 
            ) : (
              <FaRegHeart size={20} />
            )}
          </Button>
        </div>

        <table className="details-table w-100 m-0 mb-3">
          <tbody>
            {product.details &&
              Object.entries(product.details).map(([key, value]) => (
                <tr key={key} className="border-bottom-theme">
                  <td className="text-muted-theme py-2 info-key-width">
                    {key}:
                  </td>
                  <td className="text-main-theme py-2">{value}</td>
                </tr>
              ))}
          </tbody>
        </table>

        {product.tabsData && product.tabsData.description && (
          <div className="mt-3">
            <div
              className={`product-desc-text ${!isDescExpanded ? "line-clamp-2" : ""}`}
            >
              {product.tabsData.description}
            </div>
            <a
              href="#"
              className="expand-desc-btn d-inline-block mt-1"
              onClick={(e) => {
                e.preventDefault();
                setIsDescExpanded(!isDescExpanded);
              }}
            >
              {isDescExpanded ? "Read less" : "Read more"}
            </a>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-start">
      <div className="stock-status mb-2">
        <FaCheck /> {product.status}
      </div>
      <h1 className="product-main-title">{product.title}</h1>
      <div className="d-flex align-items-center gap-3 product-meta-text flex-wrap">
        <div className="d-flex align-items-center gap-1">
          {renderStars(product.rating)}
          <span className="text-warning fw-bold ms-1">{product.score}</span>
        </div>
        <span>•</span>
        <div className="d-flex align-items-center gap-1">
          <FaCommentDots /> {product.reviews} reviews
        </div>
        <span>•</span>
        <div className="d-flex align-items-center gap-1">
          <FaShoppingBasket /> {product.sold} sold
        </div>
      </div>
      <div className="price-tiers-container mt-4">
        {product.priceTiers?.map((tier, idx) => (
          <div key={idx} className="price-tier">
            <div className={`tier-price ${tier.active ? "active" : ""}`}>
              {formatPrice(variantData?.price || tier.price)}
            </div>
            <div className="tier-qty">{tier.qty}</div>
          </div>
        ))}
      </div>

      {renderOptionsUI()}

      <table className="top-info-table mt-4">
        <tbody>
          {product.details &&
            Object.entries(product.details).map(([key, value]) => {
              const checkKey = key.toLowerCase();
              const hasSeparator =
                checkKey === "price" ||
                checkKey === "design" ||
                checkKey === "warranty";
              return (
                <tr
                  key={key}
                  className={hasSeparator ? "row-has-separator" : ""}
                >
                  <td className="text-muted-theme">{key}:</td>
                  <td className="text-main-theme">{value}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}