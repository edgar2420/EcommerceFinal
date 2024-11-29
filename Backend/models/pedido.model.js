module.exports = (sequelize, Sequelize) => {
    const Pedido = sequelize.define("pedido", {
        total: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        estado: {
            type: Sequelize.STRING,
            allowNull: false
        },
        usuarioId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });

    // Aquí se definen las asociaciones
    Pedido.associate = function(models) {
        // Relación entre Pedido y Usuario (uno a muchos)
        Pedido.belongsTo(models.Usuario, {
            foreignKey: 'usuarioId'
        });

        // Relación entre Pedido y Producto (muchos a muchos)
        Pedido.belongsToMany(models.Producto, {
            through: models.PedidoProducto, // Tabla intermedia
            foreignKey: 'pedidoId',
            otherKey: 'productoId'
        });

        // Relación entre Pedido y Pago (uno a muchos)
        Pedido.hasMany(models.Pago, {
            foreignKey: 'pedidoId'
        });
    };

    return Pedido;
};
