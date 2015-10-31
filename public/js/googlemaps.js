var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var start = new google.maps.LatLng(61.04767, 28.09706);
  var mapOptions = {
    zoom:7,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: start
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  directionsDisplay.setMap(map);
  calcRoute();
}

function calcRoute() {
  var start = 'Lappeenranta, Finland';
  var end = $('#street').val() + ' ' + $('#street_number').val() + ', ' + $('#postal_code').val() + ' ' + $('#city').val() + ', ' + $('#country').val();
  console.log(end);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      start = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(start);
      drawRoute(start, end);
    }, function () {
      drawRoute(start, end);
    });
  } else {
    drawRoute(start, end);
  }
}

function drawRoute(start, end) {
  /*directionsDisplay = new google.maps.DirectionsRenderer();
  var mapOptions = {
    zoom:7,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: start
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
  directionsDisplay.setMap(map);*/
  var request = {
    origin:start,
    destination:end,
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);