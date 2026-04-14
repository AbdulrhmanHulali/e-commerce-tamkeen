import { useState, useEffect, useContext } from "react";
import { AppContext } from "../Contexts/AppContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Container, Spinner } from "react-bootstrap";
import { api_config } from "../Config/api"; 
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function HomeSlider() {
  const { lang } = useContext(AppContext);
  const [sliders, setSliders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSliders = () => {
      setIsLoading(true);
      fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.SLIDER}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Language": lang,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("API not ready yet or 404 Not Found");
          return res.json();
        })
        .then((result) => {
          if (result.code === 1 && result.data) {
            setSliders(result.data || []);
          }
        })
        .catch((err) => console.error("Error fetching sliders:", err))
        .finally(() => setIsLoading(false));
    };
    fetchSliders();
  }, [lang]);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </div>
    );
  }

  if (!sliders || sliders.length === 0) return null;

  return (
    <div className="home-slider-wrapper mb-4 pt-3">
      <Container>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper rounded-3 shadow-sm"
          style={{ height: "400px" }}
        >
          {sliders.map((slide, index) => (
            <SwiperSlide key={slide.id || index}>
              <img
                src={slide.image}
                alt={slide.title || "Slider"}
                className="w-100 h-100 object-fit-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </div>
  );
}
