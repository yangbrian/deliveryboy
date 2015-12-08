
var socket = io.connect();
socket.on('connect', function (data) {
  socket.emit('join', 'Hello World from client');
});

socket.on('new-order', function (data) {
  addToSidebar(data);
});

var clicked = false;

function delivered(obj){
  var node = obj.parentNode;
  while(node.getAttribute('class') !== 'list-group-item'){
    node = node.parentNode;

  }
  var name = node.textContent.slice(node.textContent.indexOf(':')+2,node.textContent.length);
  $.post('/order/delivered',{'deliveredOrders':JSON.stringify(name)});
  node.remove();
}

function acceptanceClick(node){
  var name = node.parentNode.firstChild.textContent;

  var li = document.getElementById('lastClicked');
  //
  $('#updatesList').append('<a href="#" class="list-group-item">' +
  '<span class="badge"><button onclick = delivered(this) class = "btn btn-primary btn-xs">Delivered</button></span>'+name+'</a>');



  li.remove();


}


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
  '<li><strong>Order: </strong>' + order.order + '</li><button onclick=acceptanceClick(this) class="btn"> Deliver me!</button>' +
  '</ul>');

  $('#sidebar').prepend(sidebar);


  sidebar.click(function() {
    $('.open-orders').popover('hide');


    sidebar.popover('toggle', {
      html: true,
      trigger: 'click focus',
      placement: 'right'
    });
  });

  $('li').click(function(){
    if(clicked === false){
      $(this).attr('id','lastClicked');
      clicked = true;
    }else{
      $('#lastClicked').removeAttr('id');
      $(this).attr('id','lastClicked');
    }

  });


}



$(document).click(function(event) {

  if(!$(event.target).closest('.popover').length && !$(event.target).closest('.open-orders').length) {
    if($('.popover').is(":visible")) {
      $('.popover').hide();
    }
  }
});

$.get('/order/activeOrders',function(order){


  for(var i =0;i<order.length;i++){


    addToSidebar(order[i]);
  }


});
