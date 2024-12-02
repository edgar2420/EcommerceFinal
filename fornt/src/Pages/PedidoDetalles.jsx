import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Para obtener el parámetro de la URL
import { ApiService } from '../service/ApiService';  // Asegúrate de importar ApiService

export default function PedidoDetalles() {
  const { id } = useParams();  // Obtener el id del pedido de la URL
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidoDetalles = async () => {
      try {
        const pedidoData = await ApiService.getPedidoById(id); // Obtener el pedido por su ID
        setPedido(pedidoData); // Guardamos el pedido en el estado
      } catch (error) {
        setError('Hubo un error al obtener los detalles del pedido.');
      } finally {
        setLoading(false);
      }
    };

    fetchPedidoDetalles();
  }, [id]);

  if (loading) {
    return <div>Cargando detalles del pedido...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!pedido) {
    return <div>No se encontró el pedido.</div>;
  }

  // Parsear imagenUrl
  const imagenes = JSON.parse(pedido.productos[0].imagenUrl);
  const imagenProducto = imagenes[0]; // Usamos la primera imagen

  return (
    <div className="container my-4">
      <h3>Detalles del Pedido #{pedido.id}</h3>

      {/* Información general del pedido */}
      <div className="card mb-3">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={imagenProducto ? `https://backendecommerce-dy3z.onrender.com${imagenProducto}` : "https://via.placeholder.com/150"}
              className="img-fluid rounded-start"
              alt="Producto"
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">Pedido #{pedido.id}</h5>
              <p className="card-text">Estado: {pedido.estado}</p>
              <p className="card-text">Total: ${pedido.total}</p>
              <p className="card-text">Fecha de creación: {new Date(pedido.createdAt).toLocaleString()}</p>

              <h6>Productos</h6>
              <ul>
                {pedido.productos.map(producto => (
                  <li key={producto.id}>
                    <strong>{producto.nombre}</strong>
                    <p>{producto.descripcion}</p>
                    <p>Precio: ${producto.precio}</p>
                    <p>Cantidad: {producto.pedido_producto.cantidad}</p>
                  </li>
                ))}
              </ul>

              <h6>Pagos</h6>
              {pedido.pagos && pedido.pagos.length > 0 ? (
                <ul>
                  {pedido.pagos.map(pago => (
                    <li key={pago.id}>
                      <p>Método de pago: {pago.metodoPago}</p>
                      <p>Estado de pago: {pago.estado}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No se ha realizado ningún pago.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
