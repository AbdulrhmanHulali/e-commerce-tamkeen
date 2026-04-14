import { useState, useEffect } from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function ProductGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openFancybox = (index = activeIndex) => {
    const fancyboxImages = images.map((img) => ({
      src: img,
      type: "image",
    }));
    Fancybox.show(fancyboxImages, { startIndex: index });
  };

  if (isMobile) {
    return (
      <div className="mobile-product-swiper w-100 overflow-hidden mobile-swiper-wrapper">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
          className="bg-transparent pb-4"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx} onClick={() => openFancybox(idx)}>
              <div className="d-flex justify-content-center align-items-center mobile-swiper-image-box">
                <img
                  src={img}
                  alt={`Product ${idx}`}
                  className="mw-100 mh-100 object-fit-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  return (
    <div className="product-gallery-wrapper">
      <div
        className="main-image-box fancybox-trigger"
        onClick={() => openFancybox(activeIndex)}
      >
        <img
          src={images[activeIndex]}
          alt="Product Main"
          className="main-product-img"
        />
      </div>
      <div className="thumbnail-list">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`thumbnail-box ${activeIndex === idx ? "active" : ""}`}
            onClick={() => setActiveIndex(idx)}
          >
            <img
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              className="thumbnail-img"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
