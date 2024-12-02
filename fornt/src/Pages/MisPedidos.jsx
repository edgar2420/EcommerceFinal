import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext'; // Para obtener el ID del usuario
import { useNavigate } from 'react-router-dom';
import { ApiService } from '../service/ApiService';  // Asegúrate de importar ApiService

export default function MisPedidos() {
  const { user } = useUser(); // Obtener el usuario del contexto
  const navigate = useNavigate();
  
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtrar los pedidos por estado
  const [pedidosExito, setPedidosExito] = useState([]);
  const [pedidosRechazados, setPedidosRechazados] = useState([]);
  const [pedidosPendientes, setPedidosPendientes] = useState([]);

  useEffect(() => {
    // Si el usuario no está autenticado, redirigir al inicio
    if (!user || !user.id) {
      navigate('/');
      return;
    }

    // Obtener los pedidos del usuario usando ApiService
    const fetchPedidos = async () => {
      try {
        // Si no tienes un usuario, no haces la llamada a la API
        if (!user.id) {
          setError('No se pudo obtener el ID del usuario.');
          return;
        }

        const pedidoData = await ApiService.getPedidos(user.id); // Llamada a la API

        console.log('Respuesta de la API:', pedidoData);  // Verifica la estructura de la respuesta

        if (pedidoData) {
          if (pedidoData.estado === 'Exito') {
            setPedidosExito([pedidoData]);
          } else if (pedidoData.estado === 'Rechazado') {
            setPedidosRechazados([pedidoData]);
          } else if (pedidoData.estado === 'Pendiente') {
            setPedidosPendientes([pedidoData]);
          }
        } else {
          setError('No se han encontrado pedidos.');
        }

      } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        setError('Hubo un error al obtener los pedidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [user, navigate]);

  const handleVerDetalles = (pedidoId) => {
    navigate(`/pedido/${pedidoId}`);
  };

  if (loading) {
    return <div>Cargando pedidos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container my-4">
      <h3 className="card-title">Mis Pedidos</h3>

      {/* Mostrar pedidos exitosos */}
      <h4>Pedidos Exitosos</h4>
      {pedidosExito.length > 0 ? (
        <div className="row">
          {pedidosExito.map(pedido => {
            // Parseamos imagenUrl si es una cadena JSON
            const imagenes = JSON.parse(pedido.productos[0].imagenUrl);
            const imagenProducto = imagenes[0]; // Usamos la primera imagen

            return (
              <div key={pedido.id} className="col-md-4 mb-3">
                <div className="card">
                  <img
                    src={imagenProducto ? `https://backendecommerce-dy3z.onrender.com${imagenProducto}` : "https://via.placeholder.com/150"} 
                    className="card-img-top"
                    alt="Producto"
                  />
                  <div className="card-body">
                    <h5 className="card-title">Pedido #{pedido.id}</h5>
                    <p className="card-text">Total: Bs{pedido.total}</p>
                    <p className="card-text">Estado: {pedido.estado}</p>
                    <button className="btn btn-primary" onClick={() => handleVerDetalles(pedido.id)}>
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No tienes pedidos exitosos.</p>
      )}

      {/* Mostrar pedidos rechazados */}
      <h4>Pedidos Rechazados</h4>
      {pedidosRechazados.length > 0 ? (
        <div className="row">
          {pedidosRechazados.map(pedido => {
            const imagenes = JSON.parse(pedido.productos[0].imagenUrl);
            const imagenProducto = imagenes[0]; // Usamos la primera imagen

            return (
              <div key={pedido.id} className="col-md-4 mb-3">
                <div className="card">
                  <img
                    src={imagenProducto ? `https://backendecommerce-dy3z.onrender.com${imagenProducto}` : "https://via.placeholder.com/150"}
                    className="card-img-top"
                    alt="Producto"
                  />
                  <div className="card-body">
                    <h5 className="card-title">Pedido #{pedido.id}</h5>
                    <p className="card-text">Total: Bs{pedido.total}</p>
                    <p className="card-text">Estado: {pedido.estado}</p>
                    <button className="btn btn-primary" onClick={() => handleVerDetalles(pedido.id)}>
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No tienes pedidos rechazados.</p>
      )}

      {/* Mostrar pedidos pendientes */}
      <h4>Pedidos Pendientes</h4>
      {pedidosPendientes.length > 0 ? (
        <div className="row">
          {pedidosPendientes.map(pedido => {
            const imagenes = JSON.parse(pedido.productos[0].imagenUrl);
            const imagenProducto = imagenes[0]; // Usamos la primera imagen

            return (
              <div key={pedido.id} className="col-md-4 mb-3">
                <div className="card">
                  <img
                    src={imagenProducto ? `https://backendecommerce-dy3z.onrender.com${imagenProducto}` : "https://via.placeholder.com/150"}
                    className="card-img-top"
                    alt="Producto"
                  />
                  <div className="card-body">
                    <h5 className="card-title">Pedido #{pedido.id}</h5>
                    <p className="card-text">Total: Bs{pedido.total}</p>
                    <p className="card-text">Estado: {pedido.estado}</p>
                    <button className="btn btn-primary" onClick={() => handleVerDetalles(pedido.id)}>
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No tienes pedidos pendientes.</p>
      )}
    </div>
  );
}
