var menu_data = null;
var order_data = null;
var active_order_data = null;


function clearAlert() {
    console.log("clear alert");
    var alert = document.getElementById("alert-pane");
    setTimeout(function () {
        $("#alert-pane").fadeOut(3000, function () {
            alert.parentNode.removeChild(alert);
        });
    }, 2000);
}

function loadRestaurantMenu() {
    $.get("/restaurants/home/menu",function(data){
        menu_data = data;
       console.log(data);
       var dish = null;
       for ( var i = 0; i < data.length; i++) {
            $("#menu_list").append('<tr><td>'+(i+1)+'</td><td>'+data[i].name+'</td><td><a href="#">edit</a></td><td>'+data[i].price+'</td></tr>');
       }
    });
}

function bodyOnload() {
    var counts = 0;
    console.log("body onload");
    if ($("#alert-pane"))
        clearAlert();
        
    $('#tags').inputTags({
        minLength:1,
        errors: {
            empty: "Attention, a tag should contain at least one character"
        }
    });
    
    
    $('#ingradients').inputTags({
        minLength:1,
        errors: {
            empty: "Attention, a tag should contain at least one character"
        }
    });
    
    loadRestaurantMenu();
    
    // var link = document.createElement("link");
    // link.href = "/stylesheets/style.css";
    // link.rel = "stylesheet";
    // document.body.appendChild(link);
}