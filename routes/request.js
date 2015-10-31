var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get('/new/:offerid', function(req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }
  console.log(req.params.offerid);
  res.render('newrequest', {title: 'Send Request', user: req.user, error: 'Check form fields.'});
});

router.post('/new/:offerid', function(req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }
  
  var OfferRequestsModel = require('../model/requests');
  
  var date = new Date(req.body.date + ' ' + req.body.time);
  console.log(date);

  var saveRequest = new OfferRequestsModel({
    offerid : req.params.offerid,
    date : date,
    comment : req.body.comment,
    status : 'pending',
    username : req.user.username
  });

  saveRequest.save(function (err, data) {
    if (err) {
      console.log('Error while saving: ' + err.message);
    } else {
      console.log('Request saved');
    }
  });
  res.render('newrequest', {title: 'Send Request', user: req.user, error: 'Check form fields.'});
});

router.get('/list/offer/:offerid', function(req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }
  
  // Mongoose Model for DB access
  var RequestModel = require('../model/requests');
  var params = {};
  var requests = [];
  
  params.offerid = req.params.offerid;
  console.log(params);
  
  // Get data from DB and send response
  RequestModel.find(params).limit(req.body.limit).exec(function(error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log(typeof(data));
      requests = data;
    }
    res.render('listrequests', {title: 'Requests', user: req.user, requests : requests, moment: moment});
  });
});

router.get('/accept/:id', function(req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }
  
  //update request
  
  // Mongoose Model for DB access
  var RequestModel = require('../model/requests');
  var offerid = '';
  
  // Get data from DB and send response
  RequestModel.findById(req.params.id).exec(function(error, request) {
    if (error) {
      console.log(error);
    } else {
     // Reject all other requests to the same offer
      var params = {}
      params.offerid = request.offerid;
      RequestModel.update(params, {status: 'rejected'} , {multi: true} , function(error,docs) {
        if (error) {
            console.log(error);
        } else {
          request.status = 'accepted';
          offerid = request.offerid;
          request.save(function (error) {
            if (error) {
              console.log(error);
            } else {
              //Update status of offer
              var FoodOfferModel = require('../model/foodoffers');
              console.log('going to update offer..');
              FoodOfferModel.findByIdAndUpdate(request.offerid, { $set: { status: 'accepted request' }}, function (error, offer) {
                if (error) {
                    console.log(error);
                } else {
                  console.log('check');
                  res.redirect('/foodoffer/request/list/offer/' + offerid);
                }
              });
            }
          }); 
        }
      });
    }
  });
});

router.get('/pay/:id', function(req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }
  
  var RequestModel = require('../model/requests');
   RequestModel.findById(req.params.id).exec(function(error, request) {
    if (error) {
      console.log(error);
    } else {
      var FoodOfferModel = require('../model/foodoffers');
      FoodOfferModel.findById(request.offerid).exec(function(error, offer) {
        if (error) {
          console.log(error);
        } else {
          res.render('payrequest', {title: 'Send Request', user: req.user, error: 'Check form fields.', request: request, moment : moment, foodoffer: offer});
        }
      });
    }
  });
});

router.post('/pay/:id', function(req, res) {
  if (!req.user || req.user.status !== 'ENABLED') {
    return res.redirect('/login');
  }
  
  var RequestModel = require('../model/requests');
  var offerid = '';
  
   RequestModel.findById(req.params.id).exec(function(error, request) {
    if (error) {
      console.log(error);
    } else {
      request.status = 'paid (' + req.body.paymentmethod + ')';
      offerid = request.offerid;
      
      request.save(function (error) {
        if (error) {
          console.log(error);
        } else {
          var FoodOfferModel = require('../model/foodoffers');
          FoodOfferModel.findByIdAndUpdate(request.offerid, { $set: { status: 'paid' }}, function (error, offer) {
            if (error) {
                console.log(error);
            } else {
              res.redirect('/dashboard');
            }
          });
        }
      });
    }
  });
});

module.exports = router;