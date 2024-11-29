import React, { createContext, useContext, useState, useEffect } from "react";

// Crear el contexto
const UserContext = createContext();

// Hook personalizado para usar el contexto
export const useUser = () => useContext(UserContext);

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  // Cargar el usuario y el carrito desde localStorage al inicializar
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedCart = localStorage.getItem("cart");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Error al cargar los datos desde localStorage:", error);
    }
  }, []);

  // Función para iniciar sesión
  const login = (userData, cartData) => {
    setUser(userData);
    setCart(cartData || []);
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("cart", JSON.stringify(cartData || []));
    } catch (error) {
      console.error("Error al guardar los datos en localStorage:", error);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    setCart([]);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("Error al eliminar los datos de localStorage:", error);
    }
  };

  // Función para añadir un producto al carrito
  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (existingProduct) {
      // Si el producto ya está en el carrito, aumentar la cantidad
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Si el producto no está en el carrito, añadirlo con cantidad 1
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    try {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error al guardar el carrito en localStorage:", error);
    }
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const updateCartItem = (id, quantity) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );

    setCart(updatedCart);
    try {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error al actualizar el carrito en localStorage:", error);
    }
  };

  // Función para eliminar un producto del carrito
  const removeCartItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);
    try {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error al eliminar el producto del carrito en localStorage:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        cart,
        login,
        logout,
        addToCart,
        updateCartItem,
        removeCartItem,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
