import React, { useEffect, useState } from "react";
import { ApiService } from "../service/ApiService";
import ProductCard from "../Components/Home/ProductCard";

export default function Categories() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await ApiService.getCategorias();
        console.log("Categorías obtenidas:", response);
        setCategorias(response);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const fetchProductosPorCategoria = async (categoriaId) => {
    setLoading(true);
    try {
      console.log("Fetching productos for categoriaId:", categoriaId);
      const response = await ApiService.getProductosPorCategoria(categoriaId);
      console.log("Productos obtenidos:", response);
      setProductos(response);
      setCategoriaSeleccionada(categoriaId);
    } catch (error) {
      console.error("Error al obtener productos por categoría:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Categorías</h2>
      <div className="row mb-4">
        {categorias.map((categoria) => (
          <div className="col-lg-3 col-md-4 col-sm-6" key={categoria.id}>
            <button
              className={`btn btn-outline-primary w-100 ${
                categoriaSeleccionada === categoria.id ? "active" : ""
              }`}
              onClick={() => fetchProductosPorCategoria(categoria.id)}
            >
              {categoria.nombre}
            </button>
          </div>
        ))}
      </div>

      <h3 className="my-4">
        {categoriaSeleccionada
          ? `Productos en la categoría: ${
              categorias.find((cat) => cat.id === categoriaSeleccionada)?.nombre
            }`
          : "Selecciona una categoría"}
      </h3>

      {loading ? (
        <div>Cargando productos...</div>
      ) : productos.length > 0 ? (
        <div className="row">
          {productos.map((producto) => (
            <ProductCard key={producto.id} product={producto} />
          ))}
        </div>
      ) : (
        <p>No hay productos disponibles en esta categoría.</p>
      )}
    </div>
  );
}
