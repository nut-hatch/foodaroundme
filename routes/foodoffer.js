var express = require('express');
var router = express.Router();
var api_key = 'SEM348BE43AE190BBCEEE88A2460A58401E7';
var api_secret = 'MmExYTUxOTJjZTc2N2I4NDk4ZWYwYzVlMDIyYzk2YTA';
var sem3 = require('semantics3-node')(api_key,api_secret);
var moment = require('moment');

router.get('/', function(req, res) {
  
  // Mongoose Model for DB access
  var FoodOffersModel = require('../model/foodoffers');
  var params = {};
  var foodoffers = [];
  
  // Get data from DB and send response
  FoodOffersModel.find(params).limit(req.body.limit).exec(function(error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      foodoffers = data;
    }
    res.render('listfoodoffers', {title: 'Food Offers List', user: req.user, foodoffers : foodoffers, moment: moment});
  });
});

router.get('/new', function(req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }
  
  res.render('newfoodoffer', {title: 'Create Food Offer', user: req.user, error: 'Check form fields.'});
});

router.post('/new', function(req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }
  
  console.log(req.body);
  
  var FoodOffersModel = require('../model/foodoffers');

  var saveOffer = new FoodOffersModel({
    product : req.body.product,
    quantity : req.body.quantity,
    price : req.body.price,
    comment : req.body.comment,
    street : req.body.street,
    street_number : req.body.street_number,
    postal_code : req.body.postal_code,
    country : req.body.country,
    locality : req.body.city,
    creation_date : new Date(),
    creation_username : req.user.username,
    public_offer : true,
    status : 'open',
    //administrative_area_level_1 : String,
    //administrative_area_level_2 : String,
    //administrative_area_level_3 : String,
  });

  saveOffer.save(function (err, data) {
    if (err) {
      console.log('Error while saving: ' + err.message);
    } else {
      console.log('Offer saved: ' + data.product + ' for ' + data.price);
    }
  });
  res.render('newfoodoffer', {title: 'Create Food Offer', user: req.user, error: 'Check form fields.'});
});

router.get('/:id', function (req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }
  
  // Mongoose Model for DB access
  var FoodOffersModel = require('../model/foodoffers');
  var params = {};
  var foodoffer = [];
  
  params._id = req.params.id;
  console.log(params);
  
  // Get data from DB and send response
  FoodOffersModel.find(params).limit(req.body.limit).exec(function(error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      foodoffer = data[0];
    }
    res.render('showfoodoffer', {title: 'Food Offers List', user: req.user, foodoffer : foodoffer, moment: moment});
  });
  
});

module.exports = router;
