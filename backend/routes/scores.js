// backend/routes/scores.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Score = require("../models/Score");

const router = express.Router();

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch {
        return res.status(403).json({ msg: "Token invalid" });
    }
};

router.post("/", auth, async (req, res) => {
    const { wpm, accuracy, errors } = req.body;
    try {
        const score = new Score({ userId: req.userId, wpm, accuracy, errors });
        await score.save();
        res.status(201).json(score);
    } catch {
        res.status(500).json({ msg: "Server error" });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const scores = await Score.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(scores);
    } catch {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
