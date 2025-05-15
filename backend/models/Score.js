// backend/models/Score.js
const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    wpm: Number,
    accuracy: Number,
    errors: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Score", scoreSchema);
