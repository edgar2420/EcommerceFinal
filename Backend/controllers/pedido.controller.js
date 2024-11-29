const db = require("../models");
const Pedido = db.pedidos;
const {  Producto, Pago, Usuario } = require("../models");

exports.listPedidos = async (req, res) => {
    try {
        // Obtener el usuarioId desde los parámetros de la ruta
        const usuarioId = req.params.usuarioId;
        console.log("Obteniendo pedidos para el usuario con ID:", usuarioId);

        // Verificar que el usuarioId esté definido
        if (!usuarioId) {
            return res.status(400).json({ message: "No se proporcionó un ID de usuario" });
        }

        // Buscar los pedidos para el usuario específico
        const pedidos = await Pedido.findAll({
            where: { usuarioId }, // Filtra por el usuarioId proporcionado
            include: [
                {
                    model: Producto,
                    as: 'productos',  // Nombre de la asociación de productos con el pedido
                    through: { attributes: ['cantidad', 'precio'] }  // Asegúrate de que la relación intermedia (como carritoProducto) tenga estos atributos
                },
                {
                    model: Pago,
                    as: 'pagos'  // Asociación con los pagos relacionados al pedido
                }
            ],
        });

        // Si no se encuentran pedidos, devolver una respuesta de error
        if (pedidos.length === 0) {
            return res.status(404).json({ message: "No se encontraron pedidos para este usuario" });
        }

        // Si se encontraron pedidos, devolverlos en la respuesta
        res.status(200).json(pedidos);
    } catch (error) {
        console.error("Error al listar pedidos:", error);
        res.status(500).json({ message: "Error al listar pedidos", error });
    }
};

exports.getPedidoById = async (req, res) => {
    try {
        const pedidoId = req.params.id;
        console.log(`Buscando pedido con ID: ${pedidoId}`);

        const pedido = await Pedido.findByPk(pedidoId, {
            include: [
                {
                    model: db.productos,
                    as: "productos",
                    through: { attributes: ["cantidad", "precio"] }
                },
                {
                    model: db.pagos,
                    as: "pagos"
                }
            ]
        });

        if (!pedido) {
            console.log(`No se encontró el pedido con ID: ${pedidoId}`);
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        console.log(`Pedido encontrado: ${JSON.stringify(pedido)}`);
        res.status(200).json(pedido);
    } catch (error) {
        console.error("Error al obtener pedido:", error);
        res.status(500).json({ message: "Error al obtener pedido", error });
    }
};


// Obtener todos los pedidos filtrados por estado
exports.listPedidosPorEstado = async (req, res) => {
    const estado = req.params.estado; // 'Pendiente', 'Pagado', 'Fallido'

    try {
        const pedidos = await Pedido.findAll({
            where: { estado },
            include: [
                { model: db.productos, as: "productos" },
                { model: db.usuarios, as: "usuario" },
            ],
        });

        if (pedidos.length > 0) {
            return res.status(200).json(pedidos);
        } else {
            return res.status(404).json({ message: "No se encontraron pedidos con ese estado." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Hubo un error al obtener los pedidos por estado.", error });
    }
};

// Controlador en el backend
exports.createPedido = async (req, res) => {
    try {
        const { total, estado, usuarioId, productos } = req.body;

        // Si no se proporciona el total, calcularlo basado en los productos
        const pedidoTotal = total || productos.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);

        // Si no se pudo calcular el total (por ejemplo, no hay productos), devolver un error
        if (!pedidoTotal || pedidoTotal <= 0) {
            return res.status(400).json({ mensaje: 'El total debe ser mayor que cero.' });
        }

        // Crear el pedido con el total calculado
        const nuevoPedido = await db.pedidos.create({
            total: pedidoTotal,
            estado,
            usuarioId
        });

        // Relacionar productos al pedido
        const pedidoProductos = productos.map(prod => ({
            pedidoId: nuevoPedido.id,
            productoId: prod.productoId,
            cantidad: prod.cantidad,
            precio: prod.precio
        }));

        await db.pedido_productos.bulkCreate(pedidoProductos);

        return res.status(201).json({ mensaje: 'Pedido creado con éxito', pedido: nuevoPedido });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear el pedido', error: error.message });
    }
};


exports.updatePedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        await pedido.update(req.body);
        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar pedido", error });
    }
};

exports.deletePedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        await pedido.destroy();
        res.status(200).json({ message: "Pedido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar pedido", error });
    }
};
