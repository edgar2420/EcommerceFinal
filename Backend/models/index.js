const db = {};
const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
    }
);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.usuarios = require("./usuario.model")(sequelize, Sequelize);
db.productos = require("./producto.model")(sequelize, Sequelize);
db.categorias = require("./categoria.model")(sequelize, Sequelize);
db.carritos = require("./carrito.model")(sequelize, Sequelize);
db.carrito_productos = require("./carritoProducto.model")(sequelize, Sequelize);
db.pedidos = require("./pedido.model")(sequelize, Sequelize);
db.pedido_productos = require("./pedidoProducto.model")(sequelize, Sequelize);
db.pagos = require("./pago.model")(sequelize, Sequelize);

// Relaciones entre Usuario y Carrito
db.usuarios.hasOne(db.carritos, { 
    foreignKey: { name: "usuarioId", allowNull: false }, 
    onDelete: "CASCADE" 
});
db.carritos.belongsTo(db.usuarios, { 
    foreignKey: { name: "usuarioId", allowNull: false } 
});

// Relaciones entre Carrito y Producto (tabla intermedia CarritoProducto)
db.carritos.belongsToMany(db.productos, {
    through: db.carrito_productos,
    foreignKey: { name: "carritoId", allowNull: false },
    otherKey: { name: "productoId", allowNull: false }
});
db.productos.belongsToMany(db.carritos, {
    through: db.carrito_productos,
    foreignKey: { name: "productoId", allowNull: false },
    otherKey: { name: "carritoId", allowNull: false }
});

// Relaciones entre Usuario y Pedido
db.usuarios.hasMany(db.pedidos, { 
    foreignKey: { name: "usuarioId", allowNull: false }, 
    onDelete: "CASCADE" 
});
db.pedidos.belongsTo(db.usuarios, { 
    foreignKey: { name: "usuarioId", allowNull: false } 
});

// Relaciones entre Pedido y Producto (muchos a muchos, usando la tabla intermedia PedidoProducto)
db.pedidos.belongsToMany(db.productos, {
    through: db.pedido_productos,
    foreignKey: { name: "pedidoId", allowNull: false },
    otherKey: { name: "productoId", allowNull: false }
});
db.productos.belongsToMany(db.pedidos, {
    through: db.pedido_productos,
    foreignKey: { name: "productoId", allowNull: false },
    otherKey: { name: "pedidoId", allowNull: false }
});

// Relaciones entre Pedido y Pago (uno a muchos)
db.pedidos.hasMany(db.pagos, { 
    foreignKey: { name: "pedidoId", allowNull: false }, 
    onDelete: "CASCADE" // Si el pedido se elimina, se eliminan los pagos asociados
});
db.pagos.belongsTo(db.pedidos, { 
    foreignKey: { name: "pedidoId", allowNull: false }
});

// Relaciones entre Producto y Categoria
db.categorias.hasMany(db.productos, { 
    foreignKey: { name: "categoriaId", allowNull: false }, 
    onDelete: "CASCADE" 
});
db.productos.belongsTo(db.categorias, { 
    foreignKey: { name: "categoriaId", allowNull: false } 
});

// Relaciones entre Usuario y Producto
db.usuarios.hasMany(db.productos, {
    foreignKey: { name: "usuarioId", allowNull: false },
    onDelete: "CASCADE",
});
db.productos.belongsTo(db.usuarios, {
    foreignKey: { name: "usuarioId", allowNull: false },
});

// Exporta los modelos para que se puedan usar en otras partes del proyecto
module.exports = db;
