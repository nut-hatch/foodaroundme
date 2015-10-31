var express = require('express');
var router = express.Router();
var api_key = 'SEM348BE43AE190BBCEEE88A2460A58401E7';
var api_secret = 'MmExYTUxOTJjZTc2N2I4NDk4ZWYwYzVlMDIyYzk2YTA';
var sem3 = require('semantics3-node')(api_key,api_secret);

// Ajax request to fetch products with prices that correspond to a given searchterm
router.get('/', function(req, res) {
  
  // Build the request
  sem3.products.products_field("name", req.query.search)
  sem3.products.products_field("category", req.query.search);
  //sem3.products.products_field("cat_id", "18203");
  sem3.products.products_field("fields", ["name", "price", "price_currency"]);
  
  // Run the request
  sem3.products.get_products(
     function(err, data) {
        if (err) {
           console.log("Couldn't execute request: get_products");
           return;
        }
        data = JSON.parse(data);
        //console.log(data);
        console.log(typeof data);
        console.log(data.results);
        res.app.render('listproducts', {layout: false, products: data.results}, function(err, html){
          if (err) {
            console.log(err);
          }
          //console.log(html);
          res.send(html);
        });
      // View results of the request
      //console.log( "Results of request:\n" + JSON.stringify( products ) );
     }
  );
});

module.exports = router;