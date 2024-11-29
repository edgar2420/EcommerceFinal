import axios from 'axios';

// URL base de la API
const API_URL = 'http://localhost:3000/api';


const handleError = (error) => {
  console.error("API call failed: ", error.response?.data || error.message);
  throw error;
};


export const ApiService = {
  // **Usuarios**
  getUsuarios: async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getUsuarioById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/usuarios/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  getProductosPorUsuario: async (usuarioId) => {
    const response = await axios.get(`${API_URL}/productos/usuario/${usuarioId}`);
    return response.data;
},
  createUsuario: async (usuarioData) => {
    try {
      const response = await axios.post(`${API_URL}/usuarios`, usuarioData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  updateUsuario: async (id, usuarioData) => {
    try {
      const response = await axios.put(`${API_URL}/usuarios/${id}`, usuarioData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  deleteUsuario: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/usuarios/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
    // **Login**
    login: async (loginData) => {
      try {
        const response = await axios.post(`${API_URL}/login`, loginData);
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },

  // **Productos**
  getProductos: async () => {
    try {
      const response = await axios.get(`${API_URL}/productos`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getProductoById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/productos/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  createProducto: async (productoData) => {
    try {
      const response = await axios.post(`${API_URL}/productos`, productoData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  updateProducto: async (id, productoData) => {
    try {
      const response = await axios.put(`${API_URL}/productos/${id}`, productoData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  deleteProducto: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/productos/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // **Categorías**
  getCategorias: async () => {
    try {
      const response = await axios.get(`${API_URL}/categorias`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getCategoriaById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/categorias/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  createCategoria: async (categoriaData) => {
    try {
      const response = await axios.post(`${API_URL}/categorias`, categoriaData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  updateCategoria: async (id, categoriaData) => {
    try {
      const response = await axios.put(`${API_URL}/categorias/${id}`, categoriaData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  deleteCategoria: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/categorias/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // **Carritos**
  getCarritoByUsuarioId: async (usuarioId) => {
    try {
      const response = await axios.get(`${API_URL}/carritos/${usuarioId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  addProductoToCarrito: async (usuarioId, productoData) => {
    try {
      const response = await axios.post(`${API_URL}/carritos/${usuarioId}/productos`, productoData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // **Pagos**
  getPagos: async () => {
    try {
      const response = await axios.get(`${API_URL}/pagos`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  getPagoById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/pagos/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  createPago: async (pagoData) => {
    try {
      // Enviar los datos del pago para que el backend cree el PaymentIntent
      const response = await axios.post(`${API_URL}/pagos`, pagoData);

      // Devuelves el PaymentIntentId y el clientSecret para completar el pago desde el frontend
      return response.data;  // { paymentIntentId, clientSecret }
    } catch (error) {
      handleError(error);
    }
  },
  confirmarPago: async (paymentIntentId, clientSecret) => {
    try {
      const response = await axios.post(`${API_URL}/pagos/confirmar`, {
        paymentIntentId,
        clientSecret
      });
      return response.data; // Devuelves la respuesta con la confirmación del pago
    } catch (error) {
      handleError(error); // Se mantiene el mismo manejo de errores
    }
  },


  // **Pedidos**
getPedidos: async (usuarioId) => {
  try {
    // Asegúrate de pasar el usuarioId en la URL
    const response = await axios.get(`${API_URL}/pedidos/${usuarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    throw error;
  }
},
  getPedidoById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/pedidos/${id}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  createPedido: async (pedidoData) => {
    try {
      const response = await axios.post(`${API_URL}/pedidos`, pedidoData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // **Productos en Pedidos**
  getProductosEnPedido: async (pedidoId) => {
    try {
      const response = await axios.get(`${API_URL}/pedidos/${pedidoId}/productos`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },


  getProductosPorCategoria: async (categoriaId) => {
    try {
      const response = await axios.get(`${API_URL}/productos/categoria/${categoriaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (id, data) => {
    try {
      const response = await axios.put(`${API_URL}/usuarios/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  

  addProductoToPedido: async (pedidoData) => {
    try {
      const response = await axios.post(`${API_URL}/pedidos/productos`, pedidoData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};

