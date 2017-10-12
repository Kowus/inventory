var mongoose = require('mongoose');

var tranSchema = new mongoose.Schema({
    items: [
        {
            itemId: mongoose.Schema.Types.ObjectId,
            price:Number,
            qty:Number
        }
    ],
    totalPrice:Number,
    receipt:String
});

module.exports = mongoose.model("Transaction", tranSchema);