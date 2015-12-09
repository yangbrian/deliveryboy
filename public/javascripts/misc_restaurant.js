var menu_data = null;
var order_data = null;
var active_order_data = null;
var tags = null;
var ingradients = null;

var count = 0;


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
            $("#menu_list").append('<tr><td>'+(i+1)+'</td><td>'+data[i].name+'</td><td><a href="#" onclick="deleteDish(this)">delete</a><a href="#" onclick="startEditDish(this)">edit</a></td><td>'+data[i].price+'</td></tr>');
       }
    });
}

function loadRestaurantHistoryOrders() {
    $.get("/restaurants/home/orders",function(data){
        order_data = data;
        console.log(menu_data);
       console.log(data);
       var dish = null;
       for ( var i = 0; i < data.length; i++) {
            $("#order_list").append('<tr><td>'+data[i].name+'</td><td>'+data[i].user+'</td><td><a href="#" data-index="'+i+'" onclick="checkInfo(this)">'+data[i].status +'</a></td><td>'+data[i].cost+'</td></tr>');
       }
    });
}

function loadRestaurantActiveOrders() {
    $.get("/restaurants/home/activeOrders",function(data){
        
       console.log(data);
       for ( var i = 0; i < data.length; i++) {
        $("#updatesList").append(   '<a href="#" class="list-group-item updatebox">'+
                                    '<div class="table-responsive">'+
                                    '<table class="table table-bordered table-hover table-striped">'+
                                    '<thead>'+
                                    '<tr>'+
                                    '<th>name</th>'+
                                    '<th>customer</th>'+
                                    '<th>status</th>'+
                                    '<th>Amount (USD)</th>'+
                                    '</tr>'+
                                    '</thead>'+
                                    '<tbody>'+
                                    '<tr>'+
                                    '<td class="tablecell">'+data[i].name+'</td>'+
                                    '<td>'+data[i].user+'</td>'+
                                    '<td>'+data[i].status +'</td>'+
                                    '<td>'+data[i].cost+'</td>'+
                                    '</tr>'+
                                    '</tbody>'+
                                    '</table>'+
                                    '</div>'+
                                    '<!--<br>-->'+
                                    '<div class="text-right updatebox-buttons">'+
                                    '<p hidden>'+data[i].name+'</p>'+
                                    '<button class="btn btn-success" onclick="completeAccepted(this)" '+(data[i].accepted ? "style=\"display: none;\"" : "")+' >Accept</button>'+
                                    '<button class="btn btn-danger" onclick="completeDeclined(this)" '+(data[i].accepted ? "style=\"display: none;\"" : "")+' >Decline</button>'+
                                    '<button class="btn btn-success" onclick="completePublicDeliver(this)" '+((data[i].public || data[i].paid) ? "disabled" : "")+'  '+(data[i].accepted ? "" : "style=\"display: none;\"")+'>Publish</button>'+
                                    '<button class="btn btn-info" onclick="completePayment(this)" '+(data[i].paid ? "disabled" : "")+'  '+(data[i].accepted ? "" : "style=\"display: none;\"")+'>Paid</button>'+
                                    '</div>'+
                                    '</a>');
        }
    });
}

function completePublicDeliver(btn) {
    var name = btn.parentNode.firstChild.innerHTML;
    $.post("/restaurants/home/activeOrders/publish", {"name":name}, function() {
        location.reload();
    });
}

function completeDelivered(btn) {
    var name = btn.parentNode.firstChild.innerHTML;
    $.post("/restaurants/home/activeOrders/delivered", {"name":name}, function() {
        location.reload();
    });
    
}

function completePayment(btn) {
    var name = btn.parentNode.firstChild.innerHTML;
    $.post("/restaurants/home/activeOrders/paid", {"name":name}, function() {
        location.reload();
    });
}

function completeAccepted(btn) {
    var name = btn.parentNode.firstChild.innerHTML;
    $.post("/restaurants/home/activeOrders/accepted", {"name": name}, function() {
        location.reload();
    });
}

function completeDeclined(btn) {
    var name = btn.parentNode.firstChild.innerHTML;
    $.post("/restaurants/home/activeOrders/declined", {"name":name}, function() {
        location.reload();
    });
}

function loadTags() {
    $.get("/restaurants/tags", function(data){
        tags = [];
        for (var i = 0; i < data.length; i++) {
            tags.push(data[i].value);
        }
        $('#tags').trigger("tagsLoaded");
    });
}

function loadIngradients() {
    $.get("/restaurants/ingradients", function(data){
        ingradients = [];
        for (var i = 0; i < data.length; i++) {
            ingradients.push(data[i].value);
        }
        $('#ingradients').trigger("ingradientsLoaded");
            
    });
}

function startEditDish(btn) {
    var editbox = document.getElementById("dishEdit");
    editbox.style.display='block';
    var index = parseInt(btn.parentNode.parentNode.firstChild.innerHTML);
    var data = menu_data[index-1];
    
    console.log(data);
    
    document.getElementById("nameUpdate").value = data.name;
    document.getElementById("caloriesUpdate").value = data.calories;
    document.getElementById("weightUpate").value = data.weight;
    
    $("#ingradientsUpdateField").find(".inputTags-list").remove();
    $("#tagsUpdateField").find(".inputTags-list").remove();
    
    
    $('#tagsUpdate').attr("class", "form-control");
    $('#tagsUpdate').attr("value", "");
    $('#tagsUpdate').removeAttr("data-uniqid");
    $('#ingradientsUpdate').attr("value", "");
    $('#ingradientsUpdate').removeAttr("data-uniqid");
    $('#ingradientsUpdate').attr("class", "form-control");
    
    $('#tagsUpdate').inputTags({
        tags: data.tags.split(','),
        minLength:1,
        autocomplete: {
            values: tags
        },
        errors: {
            empty: "Attention, a tag should contain at least one character"
        }
    });
    
    $('#ingradientsUpdate').inputTags({
        tags: data.ingradients.split(','),
        minLength:1,
        autocomplete: {
            values: ingradients
        },
        errors: {
            empty: "Attention, a tag should contain at least one character"
        }
    });
    
    document.getElementById("dish_descriptionUpdate").value = data.description;
    
    document.getElementById("priceUpdate").value = data.price;
    
    document.getElementById("fade").style.display='block';
}

function endEditDish(btn) {
    var editbox = document.getElementById("dishEdit");
    editbox.style.display='none';
    var infobox = document.getElementById("infobox");
    infobox.style.display='none';
    $("#infobox").empty();
    document.getElementById('fade').style.display='none'
}

function deleteDish(elem) {
    var index = parseInt(elem.parentNode.parentNode.firstChild.innerHTML);
    var data = menu_data[index-1];
    var cf = confirm("Delete "+data.name+"?");
    if (cf)
        $.post("/restaurants/home/dish/delete",data, function(data) {
            window.location.href = "/restaurants/home";
        });
}

function checkInfo(elem) {
    
    
    var data = order_data[parseInt(elem.dataset.index)];
    var table = '<h3> Order Details</h3>'+
                '<table class="table table-bordered table-hover table-striped">'+
                '<tbody>'+
                '<tr>'+
                '<td> name </td>'+
                '<td>'+data.name+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td> number </td>'+
                '<td>'+data.number+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td> address </td>'+
                '<td>'+data.address+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td> restaurant </td>'+
                '<td>'+data.restaurant+'</td>'+
                '</tr>'+
                '<td> foods </td>'+
                '<td>'+data.order+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td> cost </td>'+
                '<td>'+data.cost+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td> status </td>'+
                '<td>'+data.status+'</td>'+
                '</tr>'+
                '</tbody>'+
                '</table>'+
                '<a href="#orderHistory" class="btn btn-lg btn-success" style="margin: 10px;" onclick="endEditDish(this)"> close</a>';
    $("#infobox").append(table);
    var infobox = document.getElementById("infobox");
    infobox.style.display='block';
    document.getElementById("fade").style.display='block';
    
    
}

function bodyOnload() {
    var counts = 0;
    console.log("body onload");
    if ($("#alert-pane"))
        clearAlert();
        
    loadIngradients();
    loadTags();
    
    $('#tags').on("tagsLoaded", function() {
        $('#tags').inputTags({
            minLength:1,
            autocomplete: {
                values: tags
            },
            errors: {
                empty: "Attention, a tag should contain at least one character"
            }
        });
    });
    
    
    $('#ingradients').on("ingradientsLoaded", function() {
        $('#ingradients').inputTags({
            minLength:1,
            autocomplete: {
                values: ingradients
            },
            errors: {
                empty: "Attention, a tag should contain at least one character"
            }
        });
        
        
    });
    
    loadRestaurantMenu();
    loadRestaurantHistoryOrders();
    loadRestaurantActiveOrders();
    
    // var link = document.createElement("link");
    // link.href = "/stylesheets/style.css";
    // link.rel = "stylesheet";
    // document.body.appendChild(link);
}