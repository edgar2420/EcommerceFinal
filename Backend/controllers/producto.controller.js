const db = require("../models");
const Producto = db.productos;
const Categoria = db.categorias;

exports.listProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            include: [
                {
                    model: Categoria, // Relación definida en belongsTo
                    attributes: ["id", "nombre"], // Seleccionar solo los campos necesarios
                },
            ],
        });
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al listar productos:", error);
        res.status(500).json({ message: "Error al listar productos", error });
    }
};

//Producto por usuario
// Controller del Producto: Agrega esta función
exports.getProductosPorUsuario = async (req, res) => {
    try {
        const { usuarioId } = req.params; // userId debe venir de los parámetros
        const productos = await Producto.findAll({
            where: { usuarioId },
            include: [
                {
                    model: Categoria, // Incluye las categorías si es necesario
                    attributes: ["nombre"], // Selecciona solo lo que necesitas
                },
            ],
        });
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener productos del usuario:", error);
        res.status(500).json({ message: "Error al obtener productos del usuario", error });
    }
};



exports.getProductoById = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id, {
            include: {
                model: Categoria,
                attributes: ["nombre"], // Solo incluye el nombre de la categoría
            },
        });
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener producto", error });
    }
};

// Crear un producto con la opción de subir imagen
exports.createProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, categoriaId, usuarioId } = req.body;

        // Validar los campos requeridos
        if (!nombre || !precio || !categoriaId || !usuarioId) {
            return res.status(400).json({
                message: "El nombre, precio, categoría y usuario son campos obligatorios",
            });
        }

        // Verificar si se subieron imágenes
        const imagenes = req.files?.map((file) => `/uploads/${file.filename}`) || [];

        // Crear el producto
        const nuevoProducto = await Producto.create({
            nombre,
            descripcion,
            precio,
            stock: stock || 0,
            imagenUrl: JSON.stringify(imagenes),
            categoriaId,
            usuarioId, // Asociar el producto al usuario
        });

        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({ message: "Error al crear producto", error: error.message });
    }
};


  exports.getProductosPorCategoria = async (req, res) => {
    const { categoriaId } = req.params;
    try {
      const productos = await Producto.findAll({
        where: { categoriaId },
      });
      res.status(200).json(productos);
    } catch (error) {
      console.error("Error al obtener productos por categoría:", error);
      res.status(500).json({ message: "Error al obtener productos por categoría" });
    }
  };
  
exports.updateProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        await producto.update(req.body);
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar producto", error });
    }
};

exports.deleteProducto = async (req, res) => {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        await producto.destroy();
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar producto", error });
    }
};
