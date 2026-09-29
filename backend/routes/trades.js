const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade');
const verifyAuth = require('../middleware/auth');

// Get all trades for logged-in user
router.get('/', verifyAuth, async (req, res) => {
    try {
        const trades = await Trade.find({ userId: req.user.uid }).sort({ createdAt: -1 });
        res.json(trades);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new trade
router.post('/', verifyAuth, async (req, res) => {
    try {
        const { instrument, type, amount, date } = req.body;
        const newTrade = new Trade({
            userId: req.user.uid,
            instrument,
            type,
            amount,
            date
        });
        const savedTrade = await newTrade.save();
        res.status(201).json(savedTrade);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a trade
router.delete('/:id', verifyAuth, async (req, res) => {
    try {
        const trade = await Trade.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
        if (!trade) return res.status(404).json({ error: 'Trade not found' });
        res.json({ message: 'Trade deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
