import { useState, useEffect, useContext } from "react";
import { AppContext } from "../Contexts/AppContext";
import { api_config } from "../Config/api";
import { useSearchParams } from "react-router";

export default function useCategoryPage(filters = {}) {
  const { lang } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const { category_id, search, price_from, price_to, order_by, order, page = 1 } =
    filters;

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serverError, setServerError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [categoriesList, setCategoriesList] = useState([]);

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [searchQuery, setSearchQueryRaw] = useState(search || "");
  const [sortConfig, setSortConfigRaw] = useState({
    orderBy: order_by || "created_at",
    order: order || "desc",
  });

  const [openFilters, setOpenFilters] = useState({
    category: true,
    price: true,
  });
  const maxLimit = 500000;

  const [priceRange, setPriceRange] = useState([
    price_from ? Number(price_from) : 0,
    price_to ? Number(price_to) : maxLimit,
  ]);

  const minPercent = (priceRange[0] / maxLimit) * 100;
  const maxPercent = (priceRange[1] / maxLimit) * 100;

  const toggleFilterSection = (section) => {
    setOpenFilters((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMinPriceChange = (e) => {
    const val = Math.min(Number(e.target.value), priceRange[1] - 1);
    setPriceRange([val, priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const val = Math.max(Number(e.target.value), priceRange[0] + 1);
    setPriceRange([priceRange[0], val]);
  };

  const applyPriceFilter = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("price_from", priceRange[0]);
    newParams.set("price_to", priceRange[1]);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const setSortConfig = (config) => {
    setSortConfigRaw(config);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("order_by", config.orderBy);
    newParams.set("order", config.order);
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const setSearchQuery = (val) => {
    setSearchQueryRaw(val);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      let hasChanges = false;
      if (searchQuery.trim() !== "") {
        if (searchParams.get("search") !== searchQuery) {
          newParams.set("search", searchQuery);
          newParams.set("page", "1");
          hasChanges = true;
        }
      } else {
        if (searchParams.has("search")) {
          newParams.delete("search");
          hasChanges = true;
        }
      }
      if (hasChanges) setSearchParams(newParams);
    }, 600);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchParams, setSearchParams]);

  const clearAllFilters = () => {
    setSearchQueryRaw("");
    setPriceRange([0, maxLimit]);
    setSortConfigRaw({ orderBy: "created_at", order: "desc" });

    const newParams = new URLSearchParams(searchParams);
    newParams.delete("search");
    newParams.delete("price_from");
    newParams.delete("price_to");
    newParams.delete("order_by");
    newParams.delete("order");
    newParams.delete("page");
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  useEffect(() => {
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.GET_ALL_CATEGORIES}`, {
      method: "GET",
      headers: { Accept: "application/json", "Accept-Language": lang || "en" },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 1) setCategoriesList(result.data || []);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [lang]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setServerError(null);

      try {
        const url = new URL(`${api_config.BASE_URL}/product`);
        const activeFilters = { ...filters, page };
        Object.keys(filters).forEach((key) => {
          if (
            filters[key] !== null &&
            filters[key] !== undefined &&
            filters[key] !== ""
          ) {
            url.searchParams.append(key, filters[key]);
          }
        });

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Accept-Language": lang || "en",
          },
        });

        const result = await response.json();

        if (result.code === 1) {
          setProducts(result.data || []);
          setPagination(result.meta || null);
        } else {
          setServerError(result.message || "Failed to load products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setServerError("An error occurred while fetching data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
}, [lang, category_id, search, price_from, price_to, order_by, order, page]);
  return {
    products,
    pagination,
    isLoading,
    serverError,
    viewMode,
    setViewMode,
    categoriesList,
    openFilters,
    priceRange,
    setPriceRange,
    minPercent,
    maxPercent,
    maxLimit,
    applyPriceFilter,
    handleMinPriceChange,
    handleMaxPriceChange,
    toggleFilterSection,
    showMobileFilter,
    setShowMobileFilter,
    sortConfig,
    setSortConfig,
    searchQuery,
    setSearchQuery,
    clearAllFilters,
    handlePageChange,
  };
}
