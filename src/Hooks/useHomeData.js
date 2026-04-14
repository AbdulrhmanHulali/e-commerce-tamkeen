import { useState, useEffect, useContext } from "react";
import { api_config } from "../Config/api";
import { AppContext } from "../Contexts/AppContext";

export default function useHomeData() {
  const [homeData, setHomeData] = useState(null);
  const [electronicsData, setElectronicsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { lang } = useContext(AppContext);

  useEffect(() => {
    const fetchMockDataFallback = () => {
      fetch("/data/mockdata.json")
        .then((res) => {
          if (!res.ok) throw new Error("فشل في جلب البيانات من السيرفر");
          return res.json();
        })
        .then((data) => {
          setHomeData(data.homeOutdoorData);
          setElectronicsData(data.electronicsData);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    };

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.GET_ALL_CATEGORIES}`, {
      method: "GET",
      headers: { "Accept-Language": lang, Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("فشل الاتصال بالخادم لجلب الأقسام");
        return res.json();
      })
      .then((allCategoriesResult) => {
        if (
          allCategoriesResult.code === 1 &&
          allCategoriesResult.data.length >= 2
        ) {
          const firstCategoryId = allCategoriesResult.data[0].id;
          const secondCategoryId = allCategoriesResult.data[1].id;

          const fetchFirst = fetch(
            `${api_config.BASE_URL}${api_config.ENDPOINTS.GET_CATEGORY_DETAILS}${firstCategoryId}`,
            {
              method: "GET",
              headers: { "Accept-Language": lang, Accept: "application/json" },
            },
          ).then((res) => res.json());

          const fetchSecond = fetch(
            `${api_config.BASE_URL}${api_config.ENDPOINTS.GET_CATEGORY_DETAILS}${secondCategoryId}`,
            {
              method: "GET",
              headers: { "Accept-Language": lang, Accept: "application/json" },
            },
          ).then((res) => res.json());

          return Promise.all([fetchFirst, fetchSecond]);
        } else {
          throw new Error("لا يوجد أقسام كافية من ال api");
        }
      })
      .then(([result1, result2]) => {
        const hasCategories1 = result1?.data?.categories?.length > 0;
        const hasCategories2 = result2?.data?.categories?.length > 0;

        if (hasCategories1 && hasCategories2) {
          setElectronicsData(result1.data);
          setHomeData(result2.data);
          setIsLoading(false);
          console.log("Response Data:", {
            section1: result1.data,
            section2: result2.data,
          });
        } else {
          throw new Error(" الأقسام الفرعية فارغة");
        }
      })
      .catch((err) => {
        console.error(err.message);
        console.log("جاري عرض الداتا الوهمية...");
        fetchMockDataFallback();
      });
  }, [lang]);

  return { homeData, electronicsData, isLoading, error };
}
