import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import topBanner from "../../assets/images/top-discount-banner.png";
import bottomBanner from "../../assets/images/bottom-discount-banner.png";

export default function DiscountBanner() {
  const navigate = useNavigate();

  return (
    <div className="discount-banner-wrapper mt-4 mb-4 shadow-sm position-relative">
      <div
        className="discount-banner-bg"
        style={{
          backgroundImage: `url(${topBanner}), url(${bottomBanner})`,
        }}
      ></div>

      <div className="discount-banner-content d-flex flex-column flex-md-row align-items-center justify-content-between p-4 px-md-5 text-start position-relative">
        <div className="banner-text-content mb-3 mb-md-0">
         <h4 className="fw-bold text-white mb-2 discount-banner-title">
            Super discount on more than 100 USD
          </h4>
          <p className="banner-subtext mb-0">
            Have you ever finally just write dummy info
          </p>
        </div>

        <Button
          className="shop-now-btn fw-bold px-4 py-2 border-0 shadow-none"
          onClick={() => {
            navigate("/products");
            window.scrollTo(0, 0);
          }}
        >
          Shop now
        </Button>
      </div>
    </div>
  );
}
