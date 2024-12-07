const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user_name: { type: String, required: true },
    time_stamp: { type: Date, default: Date.now },
});

const roomSchema = new mongoose.Schema({
    room_name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    message: { type: [messageSchema], default: [] }, // Embed messages in the room
    time_stamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Room", roomSchema);
