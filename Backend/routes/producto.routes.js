const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  },
});

const upload = multer({
  storage: storage,
});

// Middleware para manejar múltiples imágenes
const multipleUpload = upload.array("imagenes", 10); // El campo debe llamarse "imagenes"

module.exports = { multipleUpload };
module.exports = app => {
    let router = require("express").Router();
    const productoController = require("../controllers/producto.controller.js");

     // Rutas de productos
  router.get("/productos", productoController.listProductos);
  router.get("/productos/:id", productoController.getProductoById);
  router.get("/productos/categoria/:categoriaId", productoController.getProductosPorCategoria);

  // Crear un producto con múltiples imágenes
  router.post("/productos", multipleUpload, productoController.createProducto);

  // Actualizar un producto (opcional: puedes permitir imágenes)
  router.put("/productos/:id", multipleUpload, productoController.updateProducto);

  router.get("/productos/usuario/:usuarioId", productoController.getProductosPorUsuario);

  // Eliminar un producto
  router.delete("/productos/:id", productoController.deleteProducto);

    app.use('/api', router);
};
