const db = require("../models");
const Usuario = db.usuarios;
const Producto = db.productos;
const Categoria = db.categorias;
const bcrypt = require("bcrypt");

// Método para listar usuarios
exports.listUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ["password"] },
        });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: "Error al listar usuarios", error });
    }
};

// Método para obtener un usuario por ID
exports.getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            attributes: { exclude: ["password"] },
        });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario", error });
    }
};

// Método para crear un nuevo usuario
exports.createUsuario = async (req, res) => {
    try {
        const { nombre, email, password, tipoUsuario } = req.body;

        if (!nombre || !email || !password || !tipoUsuario) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const normalizedTipoUsuario = tipoUsuario.toLowerCase();

        if (!["comprador", "vendedor", "ambos"].includes(normalizedTipoUsuario)) {
            return res.status(400).json({ message: "Tipo de usuario no válido" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Correo electrónico no válido" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password: hashedPassword,
            tipoUsuario: normalizedTipoUsuario,
        });

        const { password: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();

        res.status(201).json({
            message: "Usuario creado con éxito",
            usuario: { ...usuarioSinPassword, tipoUsuario: normalizedTipoUsuario },
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ message: "El correo ya está en uso" });
        }
        res.status(500).json({ message: "Error al crear usuario", error: error.message });
    }
};

// Método para actualizar usuario
exports.updateUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const { nombre, email, password, tipoUsuario } = req.body;

        if (tipoUsuario && !["comprador", "vendedor", "ambos"].includes(tipoUsuario)) {
            return res.status(400).json({ message: "Tipo de usuario no válido" });
        }

        let updatedData = { nombre, email, tipoUsuario };
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        await usuario.update(updatedData);

        const { password: _, ...usuarioSinPassword } = usuario.toJSON();

        res.status(200).json({ message: "Usuario actualizado con éxito", usuario: usuarioSinPassword });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar usuario", error });
    }
};

// Método para eliminar usuario
exports.deleteUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        await usuario.destroy();
        res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario", error });
    }
};

// Método para el login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isPasswordValid = await bcrypt.compare(password, usuario.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const { password: _, ...usuarioSinPassword } = usuario.toJSON();

        res.status(200).json({
            message: "Inicio de sesión exitoso",
            usuario: usuarioSinPassword,
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};

// Método para obtener los productos de un usuario
exports.getProductosDeUsuario = async (req, res) => {
    try {
        const usuarioId = req.params.id;

        const usuario = await Usuario.findByPk(usuarioId, {
            attributes: { exclude: ["password"] },
        });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const productos = await Producto.findAll({
            where: { usuarioId },
            include: [
                {
                    model: Categoria,
                    attributes: ["id", "nombre"],
                },
            ],
        });

        res.status(200).json({ usuario, productos });
    } catch (error) {
        console.error("Error al obtener productos del usuario:", error);
        res.status(500).json({ message: "Error al obtener productos del usuario", error });
    }
};
