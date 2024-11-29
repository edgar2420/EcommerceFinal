import React, { useEffect, useState } from "react";
import { ApiService } from "../service/ApiService";
import { useUser } from "../contexts/UserContext";
import ProductCard from "../Components/Home/ProductCard";
import AddProductForm from "../Pages/AddProducts";

export default function MyProducts() {
  const { user } = useUser();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        if (user) {
          const response = await ApiService.getProductosPorUsuario(user.id);
          setProductos(response);
        }
      } catch (error) {
        console.error("Error al cargar los productos del usuario:", error);
      }
    };

    fetchProductos();
  }, [user]);

  const handleProductAdded = (nuevoProducto) => {
    setProductos((prevProductos) => [nuevoProducto, ...prevProductos]);
  };

  return (
    <div className="container mt-4">
      <h2>Mis Productos</h2>
      <button
        type="button"
        className="btn btn-primary my-3"
        data-bs-toggle="modal"
        data-bs-target="#addProductModal"
      >
        Agregar Producto
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="addProductModal"
        tabIndex="-1"
        aria-labelledby="addProductModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addProductModalLabel">
                Agregar Nuevo Producto
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Formulario de agregar producto */}
              <AddProductForm onProductAdded={handleProductAdded} />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div className="row mt-4">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <ProductCard key={producto.id} product={producto} />
          ))
        ) : (
          <p>No tienes productos registrados.</p>
        )}
      </div>
    </div>
  );
}
