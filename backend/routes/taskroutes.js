// routes/taskRoutes.js
const express = require("express");
const Task = require("../models/task");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// 🔹 Crear una tarea (Protegido)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, date, time, importance, status } = req.body;

        if (!title || !date || !time) {
            return res.status(400).json({ error: "El título, la fecha y la hora son obligatorios" });
        }

        const newTask = new Task({
            title,
            description,
            date,
            time,
            importance,
            status,
            userId: req.user.userId, // Usamos req.user.userId
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error al guardar la tarea:", error.message);
        res.status(500).json({ error: "Error al guardar la tarea", details: error.message });
    }
});

// 🔹 Obtener tareas del usuario autenticado (Protegido)
router.get("/", authMiddleware, async (req, res) => {
    try {
        console.log("🔎 Buscando tareas del usuario:", req.user.userId);
        const tasks = await Task.find({ userId: req.user.userId }); // Usamos req.user.userId

        console.log(`✅ ${tasks.length} tareas encontradas.`);
        res.json(tasks);
    } catch (error) {
        console.error("❌ Error al obtener tareas:", error.message);
        res.status(500).json({ error: "Error al obtener tareas" });
    }
});

// 🔹 Actualizar una tarea (fecha, hora o estado)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        console.log("🔄 Actualizando tarea:", req.params.id, "Usuario:", req.user.userId);
        const { status, date, time } = req.body; // Asegurar que date y time se capturan correctamente

        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { status, ...(date && { date }), ...(time && { time }) }, // Solo actualiza si los valores existen
            { new: true }
        );

        if (!updatedTask) {
            console.log("⚠️ Tarea no encontrada o no pertenece al usuario.");
            return res.status(404).json({ error: "Tarea no encontrada o no tienes permisos" });
        }

        console.log("✅ Tarea actualizada:", updatedTask);
        res.json(updatedTask);
    } catch (error) {
        console.error("❌ Error al actualizar la tarea:", error.message);
        res.status(500).json({ error: "Error al actualizar la tarea", details: error.message });
    }
});


// 🔹 Eliminar una tarea (Protegido)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        console.log("🗑️ Eliminando tarea:", req.params.id, "Usuario:", req.user.userId);
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.userId }); // Usamos req.user.userId

        if (!task) {
            console.log("⚠️ Tarea no encontrada o no pertenece al usuario.");
            return res.status(404).json({ error: "Tarea no encontrada o no tienes permisos" });
        }

        console.log("✅ Tarea eliminada correctamente.");
        res.json({ message: "Tarea eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar la tarea:", error.message);
        res.status(500).json({ error: "Error al eliminar la tarea", details: error.message });
    }
});

module.exports = router;