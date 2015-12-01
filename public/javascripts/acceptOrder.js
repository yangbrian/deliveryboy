// var socket = io();

// socket.on('order', function(order) {
//     var tableString = '<tr><td name ="name">' + order.name + '</td><td>' + order.address + '</td><td>' + order.restaurant + '</td><td>' + order.order +
//         '</td><td> <label><input name = "checkedOrder" type="checkbox" value=""></label></td></tr>';
//     $('#ordersTable').append(tableString);

// });


var socket = io.connect('http://localhost:3000');
socket.on('connect', function (data) {
    socket.emit('join', 'Hello World from client');
});

socket.on('new-order', function (data) {
    var sidebar = $('<li>')
        .append(data.restaurant)
        .append(" - ")
        .append(data.order)
        .addClass('open-orders');

    $('#sidebar').prepend(sidebar);
});


$.get('/order/activeOrders',function(order){


    for(var i =0;i<order.length;i++){
     var tableString = '<tr><td name ="name">' + order[i].name + '</td><td>' + order[i].address + '</td><td>' + order[i].restaurant + '</td><td>' + order[i].order +
        '</td><td> <label><input name = "checkedOrder" type="checkbox" value=""></label></td></tr>';
    $('#ordersTable').append(tableString);

        var sidebar = $('<li>')
            .append(order[i].restaurant)
            .append(" - ")
            .append(order[i].order)
            .addClass('open-orders');

        $('#sidebar').prepend(sidebar);
    }


});



var acceptButton = document.getElementById('acceptButton');

acceptButton.onclick = function() {
    //Store accepted orders by ID number once that's set up
    var acceptedOrders = [];
    
    /*Here we get all the table rows find the input element in each row then if it's checked add the order name/id
    to the accepted orders array 
    */
    
    var rows = document.getElementsByTagName('tr');
    for (var i = 1; i < rows.length; i++) {
        
        var checkbox = rows[i].getElementsByTagName('input');
        if (checkbox[0].checked) {
            var orderName = rows[i].firstChild.textContent;
            acceptedOrders.push(orderName);
            
        }


    }
    console.log(acceptedOrders);
    $.post('/order/acceptedOrders',{'acceptedOrders':JSON.stringify(acceptedOrders)});
}


/*Next Steps
Once order is accepted remove them from current table and tables of all other users. Send accepted orders to server to process.
*/