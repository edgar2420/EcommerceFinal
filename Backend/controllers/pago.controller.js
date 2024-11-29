const db = require("../models");
const Pago = db.pagos;
const Pedido = db.pedidos;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Configura Stripe con tu clave secreta

// Listar pagos
exports.listPagos = async (req, res) => {
    try {
        const pagos = await Pago.findAll();
        res.status(200).json(pagos);
    } catch (error) {
        res.status(500).json({ message: "Error al listar pagos", error });
    }
};

// Obtener pago por ID
exports.getPagoById = async (req, res) => {
    try {
        const pago = await Pago.findByPk(req.params.id);
        if (!pago) {
            return res.status(404).json({ message: "Pago no encontrado" });
        }
        res.status(200).json(pago);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener pago", error });
    }
};

exports.createPago = async (req, res) => {
    try {
      const { totalAmount, pedidoId } = req.body;
  
      // Verifica los datos que llegan del frontend
      console.log('Datos recibidos en el backend:', req.body);  // Agregar un log para ver qué se recibe
  
      // Verifica que los parámetros sean válidos
      if (!totalAmount || !pedidoId) {
        return res.status(400).json({ message: "Faltan parámetros requeridos: totalAmount o pedidoId" });
      }
  
      // Verifica que el monto sea mayor que 0
      if (totalAmount <= 0) {
        return res.status(400).json({ message: "El monto total debe ser mayor que 0" });
      }
  
      // Crear el PaymentIntent en Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "usd",  // O la moneda que estés utilizando
      });
  
      // Crear el pago y asociarlo con el pedido
      const nuevoPago = await Pago.create({
        metodoPago: 'Stripe',
        estado: 'pendiente',  // Estado inicial del pago
        transaccionId: paymentIntent.id,
        pedidoId: pedidoId,  // Asociar con el ID del pedido
      });
  
      // Responder con el client_secret de Stripe
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,  // El client_secret para el frontend
        pagoId: nuevoPago.id,  // ID del pago creado
      });
    } catch (error) {
      console.error("Error al crear el pago:", error);
      res.status(500).json({ message: "Error al crear el pago", error });
    }
  };

// Ruta para confirmar el pago después de que el frontend lo haya procesado
exports.confirmarPago = async (req, res) => {
    const { paymentIntentId, clientSecret, pedidoId } = req.body;
  
    try {
      // Verifica que se reciban todos los datos requeridos
      if (!paymentIntentId || !clientSecret || !pedidoId) {
        return res.status(400).json({ message: "Faltan parámetros requeridos: paymentIntentId, clientSecret o pedidoId" });
      }
  
      // Verifica si el pedido existe
      const pedido = await Pedido.findByPk(pedidoId);
      if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
  
      // Aquí sería donde confirmamos el estado del pago con Stripe (por ejemplo, verificar si el pago fue exitoso)
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  
      // Verifica el estado del pago con Stripe
      if (paymentIntent.status === "succeeded") {
        // Actualiza el estado del pago en la base de datos
        await Pago.update(
          { estado: 'Confirmado', updatedAt: new Date() }, // Estado de pago confirmado
          { where: { transaccionId: paymentIntentId } }
        );
  
        // Responder con el éxito
        res.status(200).json({ message: "Pago confirmado exitosamente" });
      } else {
        return res.status(400).json({ message: "El pago no se pudo confirmar", error: "PaymentIntent status no es 'succeeded'" });
      }
    } catch (error) {
      console.error("Error al confirmar el pago:", error);
      res.status(500).json({ message: "Error al confirmar el pago", error: error.message });
    }
  };

// Actualizar pago
exports.updatePago = async (req, res) => {
    try {
        const pago = await Pago.findByPk(req.params.id);
        if (!pago) {
            return res.status(404).json({ message: "Pago no encontrado" });
        }

        await pago.update(req.body);
        res.status(200).json(pago);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar pago", error });
    }
};

// Eliminar pago
exports.deletePago = async (req, res) => {
    try {
        const pago = await Pago.findByPk(req.params.id);
        if (!pago) {
            return res.status(404).json({ message: "Pago no encontrado" });
        }

        await pago.destroy();
        res.status(200).json({ message: "Pago eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar pago", error });
    }
};
