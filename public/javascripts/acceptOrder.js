// var socket = io();

// socket.on('order', function(order) {
//     var tableString = '<tr><td name ="name">' + order.name + '</td><td>' + order.address + '</td><td>' + order.restaurant + '</td><td>' + order.order +
//         '</td><td> <label><input name = "checkedOrder" type="checkbox" value=""></label></td></tr>';
//     $('#ordersTable').append(tableString);

// });


var socket = io.connect();
socket.on('connect', function (data) {
    socket.emit('join', 'Hello World from client');
});

socket.on('new-order', function (data) {
    addToSidebar(data);
});

/**
 * Add order to open orders sidebar
 * @param order order object to add
 */
function addToSidebar(order) {
    var sidebar = $('<li>')
        .append(order.restaurant)
        .append(" - ")
        .append(order.order)
        .addClass('open-orders')
        .attr('data-html', true)
        .attr('data-toggle', 'popover')
        .attr('data-trigger', 'focus')
        .attr('title', 'Order Details')
        .attr('data-content', '<ul>' +
            '<li><strong>Name: </strong>' + order.name + '</li>' +
            '<li><strong>Restaurant: </strong>' + order.restaurant + '</li>' +
            '<li><strong>Order: </strong>' + order.order + '</li>' +
            '</ul>');

    $('#sidebar').prepend(sidebar);


    //sidebar.popover({
    //    html: true,
    //    trigger: 'click focus',
    //    placement: 'right'
    //});

    sidebar.click(function() {
        $('.open-orders').popover('hide');

        sidebar.popover('toggle', {
            html: true,
            trigger: 'click focus',
            placement: 'right'
        })
    });
}

$(document).click(function(event) {
    if(!$(event.target).closest('.popover').length && !$(event.target).closest('.open-orders').length) {
        if($('.popover').is(":visible")) {
            $('.popover').hide()
        }
    }
})

$.get('/order/activeOrders',function(order){


    for(var i =0;i<order.length;i++){
     var tableString = '<tr><td name ="name">' + order[i].name + '</td><td>' + order[i].address + '</td><td>' + order[i].restaurant + '</td><td>' + order[i].order +
        '</td><td> <label><input name = "checkedOrder" type="checkbox" value=""></label></td></tr>';
    $('#ordersTable').append(tableString);

        addToSidebar(order[i]);
    }


});


//
//var acceptButton = document.getElementById('acceptButton');
//
//acceptButton.onclick = function() {
//    //Store accepted orders by ID number once that's set up
//    var acceptedOrders = [];
//
//    /*Here we get all the table rows find the input element in each row then if it's checked add the order name/id
//    to the accepted orders array
//    */
//
//    var rows = document.getElementsByTagName('tr');
//    for (var i = 1; i < rows.length; i++) {
//
//        var checkbox = rows[i].getElementsByTagName('input');
//        if (checkbox[0].checked) {
//            var orderName = rows[i].firstChild.textContent;
//            acceptedOrders.push(orderName);
//
//        }
//
//
//    }
//    console.log(acceptedOrders);
//    $.post('/order/acceptedOrders',{'acceptedOrders':JSON.stringify(acceptedOrders)});
//}


/*Next Steps
Once order is accepted remove them from current table and tables of all other users. Send accepted orders to server to process.
*/