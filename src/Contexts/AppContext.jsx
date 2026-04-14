import { createContext, useState, useEffect } from "react";
import mockData from "../../public/data/mockdata.json";
import { api_config } from "../../Config/API"; 
// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : mockData.cartData || [];
  });
  const [favorites, setFavorites] = useState([]);

  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "USD",
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("userData");
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isNotifLoading, setIsNotifLoading] = useState(false);

  const fetchNotifications = () => {
    const token = localStorage.getItem("user_token");
    if (!token) return;

    setIsNotifLoading(true);
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.NOTIFICATIONS}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": lang,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notifications");
        return res.json();
      })
      .then((result) => {
        if (result.code === 1) {
          setNotifications(result.data || []);
        }
      })
      .catch((err) => console.error("Error fetching notifications:", err))
      .finally(() => setIsNotifLoading(false));
  };

  useEffect(() => {
    if (showNotifModal && isAuthenticated) {
      fetchNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotifModal]);
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("lang", lang);
    localStorage.setItem("currency", currency);
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [theme, lang, currency]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("guest_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const syncFavoritesToServer = (token, localFavs) => {
    const syncPromises = localFavs.map((productId) => {
      return fetch(
        `${api_config.BASE_URL}${api_config.ENDPOINTS.ADD_FAVORITE}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Accept-Language": lang,
          },
          body: JSON.stringify({ product_id: productId }),
        },
      ).then((res) => {
        if (!res.ok) throw new Error("Failed to sync favorite");
        return res.json();
      });
    });
    Promise.all(syncPromises)
      .then(() => {
        console.log("All guest favorites synced successfully!");
        localStorage.removeItem("guest_favorites");
        fetchFavorites();
      })
      .catch((err) => {
        console.error("Error during favorites sync:", err);
      });
  };

  const syncCartToServer = (token, localCart) => {
    const syncPromises = localCart.map((item) => {
      const productId = item.productId || item.id;

      return fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.ADD_CART}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Accept-Language": lang,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: item.quantity || 1,
        }),
      }).then((res) => {
        if (!res.ok) throw new Error("Failed to sync cart item");
        return res.json();
      });
    });
    Promise.all(syncPromises)
      .then(() => {
        console.log("All guest cart items synced successfully!");
        fetchCart();
      })
      .catch((err) => {
        console.error("Error during cart sync:", err);
      });
  };

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem("userData", JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem("user_token", userData.token);
      const localFavs = JSON.parse(
        localStorage.getItem("guest_favorites") || "[]",
      );
      if (localFavs.length > 0) {
        syncFavoritesToServer(userData.token, localFavs);
      }
      const localCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      if (localCart.length > 0) {
        syncCartToServer(userData.token, localCart);
      }
    }

    setShowLoginModal(false);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("user_token");
    localStorage.removeItem("guest_favorites");
    setFavorites([]);

    clearCart();
  };

  const addToCart = (product) => {
    setCartItems((prev) => {
      const isExisting = (item) => {
        const isSameProduct =
          String(item.productId || item.id) ===
          String(product.productId || product.id);
        const isSameVariant =
          String(item.variant_id || "") === String(product.variant_id || "");
        return isSameProduct && isSameVariant;
      };

      const existing = prev.find(isExisting);

      if (existing) {
        return prev.map((item) =>
          isExisting(item)
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item,
        );
      }
      return [
        ...prev,
        { ...product, productId: product.productId || product.id },
      ];
    });

    const token = localStorage.getItem("user_token");
    if (!token) {
      return;
    }
    const existingItem = cartItems.find(
      (item) =>
        String(item.productId || item.id) === String(product.id) &&
        String(item.variant_id) === String(product.variant_id),
    );
    const payload = {
      product_id: product.id,
      quantity: existingItem
        ? existingItem.quantity + (product.quantity || 1)
        : product.quantity || 1,
    };

    if (product.variant_id) {
      payload.product_variant_id = product.variant_id;
    }

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.ADD_CART}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Language": lang,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add to cart");
        return res.json();
      })
      .then((result) => {
        if (result.code === 1) {
          console.log("Successfully added to server cart:", result.data);
        } else {
          console.error("Server error adding to cart:", result.message);
        }
      })
      .catch((err) => {
        console.error("Network error adding to cart:", err);
      });
  };

  const [isCartLoading, setIsCartLoading] = useState(false);
  const fetchCart = () => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      setCartItems([]);
      return;
    }

    setIsCartLoading(true);
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.GET_CART}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": lang,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((result) => {
        if (result.code === 1) {
          console.log("response: ", result);
          const mappedCart = (result.data || []).map((item) => ({
            id: item.id,
            productId: item.product?.id,
            variant_id: item.productVariant?.id || null,
            title: item.product?.name || "Unknown Product",
            price: item.productVariant?.price || item.product?.price || 0,
            image:
              item.productVariant?.image ||
              item.product?.image ||
              "https://via.placeholder.com/150",
            quantity: item.quantity || 1,
            details: item.productVariant?.color
              ? `Color: ${item.productVariant.color}`
              : "Standard",
            seller: "Tamkeen Store",
          }));
          setCartItems(mappedCart);
        }
      })
      .catch((err) => console.error("Error fetching cart:", err))
      .finally(() => setIsCartLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCartItems([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, isAuthenticated]);

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    const token = localStorage.getItem("user_token");
    if (!token) {
      return;
    }
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.REMOVE_CART}${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Accept-Language": lang,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to remove item from cart");
        return res.json();
      })
      .then((result) => {
        if (result.code === 1) {
          console.log(`Successfully removed item ${id} from server cart`);
        } else {
          console.error("Server error removing from cart:", result.message);
        }
      })
      .catch((err) => {
        console.error("Network error removing from cart:", err);
      });
  };

  const updateQuantity = (id, newQuantity) => {
    const itemToUpdate = cartItems.find((item) => item.id === id);
    if (!itemToUpdate) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );

    const token = localStorage.getItem("user_token");
    if (!token) return;
    const payload = {
      product_id: itemToUpdate.productId || itemToUpdate.id,
      quantity: newQuantity,
    };

    if (itemToUpdate.variant_id) {
      payload.product_variant_id = itemToUpdate.variant_id;
    }
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.ADD_CART}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Accept-Language": lang,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update quantity");
        return res.json();
      })
      .then((result) => {
        if (result.code === 1) {
          console.log(
            `Successfully set quantity to ${newQuantity} for product ${payload.product_id}`,
          );
        } else {
          console.error("Server error updating quantity:", result.message);
        }
      })
      .catch((err) => {
        console.error("Network error updating quantity:", err);
      });
  };

  const clearCart = (skipApi = false) => {
    const itemsToDelete = [...cartItems];
    setCartItems([]);
    const token = localStorage.getItem("user_token");
    if (!token || itemsToDelete.length === 0 || skipApi) {
      return;
    }
    const deletePromises = itemsToDelete.map((item) => {
      return fetch(
        `${api_config.BASE_URL}${api_config.ENDPOINTS.REMOVE_CART}${item.id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Accept-Language": lang,
            Authorization: `Bearer ${token}`,
          },
        },
      ).then((res) => {
        if (!res.ok) throw new Error(`Failed to remove item ${item.id}`);
        return res.json();
      });
    });
    Promise.all(deletePromises)
      .then((results) => {
        const allSuccessful = results.every((result) => result.code === 1);
        if (allSuccessful) {
          console.log("Successfully removed all items from server cart");
        } else {
          console.error("Some items failed to be removed from the server.");
          fetchCart();
        }
      })
      .catch((err) => {
        console.error("Network error while clearing cart:", err);
      });
  };

  const cartTotalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const formatPrice = (price) => {
    if (price === undefined || price === null) return "";
    let numberPrice = Number(String(price).replace(/[^0-9.]/g, ""));
    if (isNaN(numberPrice) || numberPrice === 0) return price;
    const SYP_TO_USD_RATE = 1000;

    const rates = {
      USD: 1,
      EUR: 0.92,
      AED: 3.67,
      SAR: 3.75,
      SYP: SYP_TO_USD_RATE,
    };

    const symbols = {
      USD: "$",
      EUR: "€",
      AED: " AED ",
      SAR: " SAR ",
      SYP: " SY.P",
    };

    if (currency === "SYP") {
      return numberPrice.toLocaleString() + symbols["SYP"];
    }
    let priceInUSD = numberPrice / SYP_TO_USD_RATE;
    let finalPrice = priceInUSD * rates[currency];
    return (
      symbols[currency] +
      finalPrice.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  };
  const fetchFavorites = () => {
    const token = localStorage.getItem("user_token");
    if (!token) {
      setFavorites([]);
      return;
    }

    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.SHOW_FAVORITE}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Language": lang,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === 1) {
          const validIds = result.data
            .filter((item) => item.product !== null)
            .map((item) => item.product.id);

          setFavorites(validIds);
        }
      })
      .catch((err) => console.error("Error fetching favorites:", err));
  };
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      const guestFavs = JSON.parse(
        localStorage.getItem("guest_favorites") || "[]",
      );
      setFavorites(guestFavs);
    }
  }, [isAuthenticated, lang]);

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  const addToFavorites = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev : [...prev, productId],
    );

    const token = localStorage.getItem("user_token");
    if (!token) {
      return;
    }
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.ADD_FAVORITE}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
      },
      body: JSON.stringify({ product_id: productId }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code !== 1) {
          setFavorites((prev) => prev.filter((id) => id !== productId));
          if (result.message === "Unauthenticated.") {
            logout();
            setShowLoginModal(true);
          }
        }
      })
      .catch((err) => {
        console.error("Add to fav error:", err);
        setFavorites((prev) => prev.filter((id) => id !== productId));
      });
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
    const token = localStorage.getItem("user_token");
    if (!token) return;
    fetch(`${api_config.BASE_URL}${api_config.ENDPOINTS.REMOVE_FAVORITE}${productId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code !== 1) {
          setFavorites((prev) => [...prev, productId]);
        }
      })
      .catch((err) => {
        console.error("Remove from fav error:", err);
        setFavorites((prev) => [...prev, productId]);
      });
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        lang,
        setLang,
        cartItems,
        addToCart,
        isCartLoading,
        fetchCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotalItems,
        isAuthenticated,
        user,
        login,
        logout,
        showLoginModal,
        setShowLoginModal,
        currency,
        setCurrency,
        formatPrice,
        favorites,
        addToFavorites,
        isFavorite,
        removeFromFavorites,
        showNotifModal,
        setShowNotifModal,
        notifications,
        isNotifLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
