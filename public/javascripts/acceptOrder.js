// var socket = io();

// socket.on('order', function(order) {
//     var tableString = '<tr><td name ="name">' + order.name + '</td><td>' + order.address + '</td><td>' + order.restaurant + '</td><td>' + order.order +
//         '</td><td> <label><input name = "checkedOrder" type="checkbox" value=""></label></td></tr>';
//     $('#ordersTable').append(tableString);

// });

$.get('/order/activeOrders',function(order){


    for(var i =0;i<order.length;i++){
     var tableString = '<tr><td name ="name">' + order[i].name + '</td><td>' + order[i].address + '</td><td>' + order[i].restaurant + '</td><td>' + order[i].order +
        '</td><td> <label><input name = "checkedOrder" type="checkbox" value=""></label></td></tr>';
    $('#ordersTable').append(tableString);
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
}


/*Next Steps
Once order is accepted remove them from current table and tables of all other users. Send accepted orders to server to process.
*/