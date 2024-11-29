import React, { useState, useEffect } from "react";
import { ApiService } from "../service/ApiService";
import { useUser } from "../contexts/UserContext";

export default function AddProductForm({ onProductAdded }) {
  const { user } = useUser(); // Obtener el usuario autenticado
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoriaId: "",
    imagenes: [],
  });
  const [loadingCategorias, setLoadingCategorias] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Obtener categorías al cargar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await ApiService.getCategorias();
        setCategorias(response);
        setLoadingCategorias(false);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setError("No se pudieron cargar las categorías.");
        setLoadingCategorias(false);
      }
    };

    fetchCategorias();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar la selección de múltiples imágenes
  const handleFileChange = (e) => {
    setFormData({ ...formData, imagenes: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Agregar datos de texto
    for (const key in formData) {
      if (key !== "imagenes") {
        formDataToSend.append(key, formData[key]);
      }
    }

    // Agregar el usuarioId del usuario autenticado
    formDataToSend.append("usuarioId", user.id);

    // Agregar múltiples imágenes
    Array.from(formData.imagenes).forEach((file) => {
      formDataToSend.append("imagenes", file);
    });

    try {
      const nuevoProducto = await ApiService.createProducto(formDataToSend);
      setSuccessMessage("Producto creado con éxito");
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoriaId: "",
        imagenes: [],
      });

      // Notificar al componente padre que se agregó un nuevo producto
      if (onProductAdded) {
        onProductAdded(nuevoProducto);
      }
    } catch (error) {
      console.error("Error al crear producto:", error.response || error.message);
      setError("Error al crear el producto. Verifica los datos.");
    }
  };

  return (
    <div className="container">
      <h2>Agregar Nuevo Producto</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">
            Descripción
          </label>
          <textarea
            className="form-control"
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="precio" className="form-label">
            Precio
          </label>
          <input
            type="number"
            className="form-control"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="stock" className="form-label">
            Stock
          </label>
          <input
            type="number"
            className="form-control"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="categoriaId" className="form-label">
            Categoría
          </label>
          {loadingCategorias ? (
            <div>Cargando categorías...</div>
          ) : (
            <select
              className="form-select"
              id="categoriaId"
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="imagenes" className="form-label">
            Imágenes
          </label>
          <input
            type="file"
            className="form-control"
            id="imagenes"
            name="imagenes"
            multiple
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </form>
    </div>
  );
}
