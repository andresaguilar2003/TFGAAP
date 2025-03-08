const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fcmToken: { type: String }  // 🔥 Guardamos el token FCM
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
