function throttle(f, delay){
    var timer = null;
    return function(){
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = window.setTimeout(function(){
            f.apply(context, args);
        },
        delay || 700);
    };
}

$(function(){
 $('#product').on('keyup', throttle(function(e){
   //if(e.keyCode === 13) {
     var parameters = { search: $(this).val() };
       $.get('/foodoffer/products',parameters, function(data) {
       $('#results').html(data);
     });
   // };
 }));
});

$('#date').datepicker();
$('#time').timepicker();