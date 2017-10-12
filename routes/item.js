const express = require('express');
const router = express.Router();
let Item = require('../models/items.model');

router.get('/', function(req, res, next) {
    console.log(req.user);
    res.render('index', { title: 'Dashboard', user:req.user });
});


router.get('/items', function (req, res, next) {
    Item.find({}, function (err, items) {
        if (err) return res.send(err);
        res.render('items', {user: req.user, items: items});
    });
});
router.post('/items/add', function (req, res, next) {
    let newItem = new Item();
    newItem.name = req.body.name;
    newItem.price = req.body.price;
    newItem.qty = req.body.qty;

    if (req.body.watt) newItem.rating.watt = req.body.watt;

    newItem.save(function (err, item) {
        if(err)return res.send(err);
        res.json(item);
    })

});
module.exports = router;