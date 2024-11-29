module.exports = (sequelize, Sequelize) => {
    const Pago = sequelize.define("pago", {
        metodoPago: {
            type: Sequelize.STRING,
            allowNull: false
        },
        estado: {
            type: Sequelize.ENUM("exitoso", "fallido", "pendiente"),
            defaultValue: "pendiente" // Estado inicial del pago
        },
        transaccionId: {
            type: Sequelize.STRING,
        },
        // Relación con el Pedido
        pedidoId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Pedidos', // Asegúrate de que el nombre de la tabla 'Pedidos' esté bien
                key: 'id'
            },
            allowNull: false, // Es obligatorio tener un pedido asociado a un pago
        }
    });

    // Definir la relación con el modelo Pedido
    Pago.associate = models => {
        Pago.belongsTo(models.Pedido, {
            foreignKey: 'pedidoId',
            as: 'pedido'
        });
    };

    return Pago;
};
