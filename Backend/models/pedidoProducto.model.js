module.exports = (sequelize, Sequelize) => {
    const PedidoProducto = sequelize.define("pedido_producto", {
        cantidad: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        precio: {
            type: Sequelize.FLOAT,
            allowNull: false
        },
        pedidoId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'pedidos',  // Asegúrate de que la tabla se llama 'pedidos'
                key: 'id'
            }
        },
        productoId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'productos',  // Asegúrate de que la tabla se llama 'productos'
                key: 'id'
            }
        }
    });

    return PedidoProducto;
};
