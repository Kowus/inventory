"use strict";

var mongoose = require('mongoose');
var itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        watt: Number
    },
    price: {
        type: Number
    },
    qty: Number,
    totalPurchases: { type: Number, default: 0 }
});

module.exports = mongoose.model("Item", itemSchema);
//# sourceMappingURL=items.model.js.map