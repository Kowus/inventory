'use strict';

var express = require('express');
var router = express.Router();
var Item = require('../models/items.model');

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Dashboard', user: req.user });
});

router.get('/items', function (req, res, next) {
    Item.find({}, function (err, items) {
        if (err) return res.send(err);
        res.render('items', { user: req.user, items: items });
    });
});

router.post('/items/update', function (req, res, next) {
    Item.findOne({ _id: req.body._id }, function (err, item) {
        item.name = req.body.name;
        item.qty = req.body.qty;
    });
});

router.post('/items/add', function (req, res, next) {
    var newItem = new Item();
    newItem.name = req.body.name;
    newItem.price = req.body.price;
    newItem.qty = req.body.qty;

    if (req.body.watt) newItem.rating.watt = req.body.watt;

    newItem.save(function (err, item) {
        if (err) return res.send(err);
        res.json(item);
    });
});
module.exports = router;
//# sourceMappingURL=item.js.map