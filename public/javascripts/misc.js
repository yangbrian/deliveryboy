// var menu_data = null;
// var order_data = null;
// var active_order_data = null;
// var tags = null;
// var ingradients = null;

// var count = 0;


function clearAlert() {
    console.log("clear alert");
    var alert = document.getElementById("alert-pane");
    setTimeout(function () {
        $("#alert-pane").fadeOut(3000, function () {
            alert.parentNode.removeChild(alert);
        });
    }, 2000);
}

// function loadRestaurantMenu() {
//     $.get("/restaurants/home/menu",function(data){
//         menu_data = data;
//       console.log(data);
//       var dish = null;
//       for ( var i = 0; i < data.length; i++) {
//             $("#menu_list").append('<tr><td>'+(i+1)+'</td><td>'+data[i].name+'</td><td><a href="#">edit</a></td><td>'+data[i].price+'</td></tr>');
//       }
//     });
// }

// function loadRestaurantHistoryOrders() {
//     $.get("/restaurants/home/orders",function(data){
//         menu_data = data;
//       console.log(data);
//       var dish = null;
//       for ( var i = 0; i < data.length; i++) {
//             $("#order_list").append('<tr><td>'+data[i].name+'</td><td>'+data[i].user+'</td><td><a href="#">'+(data[i].paid ? "paid" : (data[i].paid ? "delivered" : "active")) +'</a></td><td>'+data[i].cost+'</td></tr>');
//       }
//     });
// }

// function loadRestaurantActiveOrders() {
//     $.get("/restaurants/home/activeOrders",function(data){
//         menu_data = data;
//       console.log(data);
//       for ( var i = 0; i < data.length; i++) {
//         $("#updatesList").append(   '<a href="#" class="list-group-item updatebox">'+
//                                     '<div class="table-responsive">'+
//                                     '<table class="table table-bordered table-hover table-striped">'+
//                                     '<thead>'+
//                                     '<tr>'+
//                                     '<th>name</th>'+
//                                     '<th>customer</th>'+
//                                     '<th>status</th>'+
//                                     '<th>Amount (USD)</th>'+
//                                     '</tr>'+
//                                     '</thead>'+
//                                     '<tbody>'+
//                                     '<tr>'+
//                                     '<td class="tablecell">'+data[i].name+'</td>'+
//                                     '<td>'+data[i].user+'</td>'+
//                                     '<td>'+(data[i].delivered ? "delivered" : (data[i].paid ? "paid" : "active")) +'</td>'+
//                                     '<td>'+data[i].cost+'</td>'+
//                                     '</tr>'+
//                                     '</tbody>'+
//                                     '</table>'+
//                                     '</div>'+
//                                     '<!--<br>-->'+
//                                     '<div class="text-right updatebox-buttons">'+
//                                     '<p hidden>'+data[i].name+'</p>'+
//                                     '<button class="btn btn-info" onclick="completeDelivered(this)" >Delivered</button>'+
//                                     '<button class="btn btn-success" onclick="completePayment(this)">Paid</button>'+
//                                     '</div>'+
//                                     '</a>');
//         }
//     });
// }

// function completeDelivered(btn) {
//     var name = btn.parentNode.firstChild.innerHTML;
//     $.post("/restaurants/home/activeOrders/delivered", {"name":name}, function() {
//         location.reload();
//     });
    
// }

// function completePayment(btn) {
//     var name = btn.parentNode.firstChild.innerHTML;
//     $.post("/restaurants/home/activeOrders/paid", {"name":name}, function() {
//         location.reload();
//     });
// }

// function loadTags() {
//     $.get("/restaurants/tags", function(data){
//         tags = [];
//         for (var i = 0; i < data.length; i++) {
//             tags.push(data[i].value);
//         }
//         $('#tags').trigger("tagsLoaded");
//     });
// }

// function loadIngradients() {
//     $.get("/restaurants/ingradients", function(data){
//         ingradients = [];
//         for (var i = 0; i < data.length; i++) {
//             ingradients.push(data[i].value);
//         }
//         $('#ingradients').trigger("ingradientsLoaded");
            
//     });
// }

function bodyOnload() {
//     var counts = 0;
//     console.log("body onload");
//     if ($("#alert-pane"))
//         clearAlert();
        
//     loadIngradients();
//     loadTags();
    
//     $('#tags').on("tagsLoaded", function() {
//         $('#tags').inputTags({
//             minLength:1,
//             autocomplete: {
//                 values: tags
//             },
//             errors: {
//                 empty: "Attention, a tag should contain at least one character"
//             }
//         });
//     });
    
    
//     $('#ingradients').on("ingradientsLoaded", function() {
//         $('#ingradients').inputTags({
//             minLength:1,
//             autocomplete: {
//                 values: ingradients
//             },
//             errors: {
//                 empty: "Attention, a tag should contain at least one character"
//             }
//         });
//     });
    
//     loadRestaurantMenu();
//     loadRestaurantHistoryOrders();
//     loadRestaurantActiveOrders();
    
    // var link = document.createElement("link");
//     // link.href = "/stylesheets/style.css";
//     // link.rel = "stylesheet";
//     // document.body.appendChild(link);
    if ($("#alert-pane"))
        clearAlert();
}


function get_start() {
    document.getElementById("fade_left").style.display='inline-block';
    document.getElementById("fade_right").style.display='inline-block';
    $("#brand").addClass("blur");
}

function cancel_start() {
    document.getElementById("fade_left").style.display='none';
    document.getElementById("fade_right").style.display='none';
    $("#brand").removeClass("blur");
}