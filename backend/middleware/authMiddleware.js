const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");

    console.log("🔍 Verificando autenticación...");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("🚫 No se encontró un token válido.");
        return res.status(401).json({ message: "Acceso denegado" });
    }

    const token = authHeader.split(" ")[1]; // Extraer solo el token
    console.log("🔑 Token recibido:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token válido. Usuario autenticado:", decoded);

        // Asegúrate de que el ID del usuario esté disponible en req.user
        req.user = { userId: decoded.userId }; // Aquí asignamos el userId
        next();
    } catch (error) {
        console.log("⚠️ Token inválido:", error.message);
        res.status(400).json({ message: "Token inválido" });
    }
};