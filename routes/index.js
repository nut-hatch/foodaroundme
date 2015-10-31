var express = require('express');
var router = express.Router();
var moment = require('moment');


// Render the home page.
router.get('/', function(req, res) {
  res.render('index', {title: 'Home', user: req.user});
});


// Render the dashboard page.
router.get('/dashboard', function (req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }

  // Mongoose Model for DB access
  var FoodOffersModel = require('../model/foodoffers');
  var RequestModel = require('../model/requests');
  var params = {};
  var foodoffers = [];
  
  params.creation_username = req.user.username;
  //params.open = true;
  
  // Get data from DB and send response
  FoodOffersModel.find(params).limit(req.body.limit).exec(function(error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      foodoffers = data;
    }
  
    params = {};
    params.username = req.user.username;
    var requests = [];
  
    // Get data from DB and send response
    RequestModel.find(params).limit(req.body.limit).exec(function(error, data) {
      if (error) {
        console.log(error);
      } else {
        console.log(typeof(data));
        requests = data;
      }
      res.render('dashboard', {title: 'Dashboard', user: req.user, foodoffers : foodoffers, requests : requests, moment : moment});
    });
  });
  
});

module.exports = router;