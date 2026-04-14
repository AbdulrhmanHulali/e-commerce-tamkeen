import { useState, useEffect, useContext } from "react";
import { api_config } from "../Config/api";
import { AppContext } from "../Contexts/AppContext";

export default function useProductDetails(id) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { lang } = useContext(AppContext);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("user_token");
    const url = `${api_config.BASE_URL}${api_config.ENDPOINTS.PRODUCT_DETAILS}${id}?with_avatar=1`;
    const productsUrl = `${api_config.BASE_URL}${api_config.ENDPOINTS.PRODUCTS}`;

    Promise.all([
      // 1. جلب تفاصيل المنتج
      fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Language": lang,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }).then((res) => (res.ok ? res.json() : null)),
      
      // 2. جلب الداتا الوهمية (للاحتفاظ ببيانات الـ tabs مؤقتاً إذا لم تكن في الـ API)
      fetch("/data/mockdata.json").then((res) => (res.ok ? res.json() : null)),

      // 3. جلب جميع المنتجات لاستخدامها كـ "منتجات ذات صلة"
      fetch(productsUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Language": lang,
        },
      }).then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([apiResult, mockData, productsResult]) => {
        if (apiResult && apiResult.code === 1 && apiResult.data) {
          const apiData = apiResult.data;
          const mockTabs = mockData?.productDetailsData?.tabsData || {};

          // معالجة المنتجات ذات الصلة (نستبعد المنتج المعروض حالياً ونأخذ 6 منتجات)
          let apiRelatedProducts = [];
          if (productsResult && productsResult.code === 1 && productsResult.data) {
            apiRelatedProducts = productsResult.data
              .filter((p) => String(p.id) !== String(id))
              .slice(0, 6);
          }

          const mappedProduct = {
            id: apiData.id,
            title: apiData.name || apiData.title, // أخذ الاسم
            price: apiData.price,
            images:
              apiData.images && apiData.images.length > 0
                ? [apiData.image, ...apiData.images]
                : [
                    apiData.image || "https://via.placeholder.com/600",
                    apiData.image || "https://via.placeholder.com/600",
                  ],

            status: "In stock",
            rating: 4.5,
            score: 4.5,
            reviews: 32,
            sold: 154,
            priceTiers: [{ qty: "1+ pcs", price: apiData.price, active: true }],
            details: {
              SKU: apiData.sku || "N/A",
              Category: apiData.category?.name || "General",
              Design: apiData.design || "Standard",
              Type: "Original",
            },
            tabsData: {
              description:
                apiData.description ||
                mockTabs.description ||
                "No description available.",
              table: mockTabs.table || [],
              features: mockTabs.features || [],
            },
            supplier: mockData?.productDetailsData?.supplier,
            is_favorite: apiData.is_favorite || false,
            
            // تعيين البيانات القادمة من الـ API بدلاً من الموك داتا
            relatedProducts: apiRelatedProducts,

            colors: apiData.colors || [],
            attributes: apiData.attributes || [],
          };

          setProduct(mappedProduct);
        } else {
          setProduct(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching product details:", err);
        setProduct(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id, lang]);

  return { product, isLoading };
}