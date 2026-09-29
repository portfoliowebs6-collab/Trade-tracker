const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    instrument: { type: String, required: true },
    type: { type: String, enum: ['Buy', 'Sell'], required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', TradeSchema);
