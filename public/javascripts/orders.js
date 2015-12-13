
var socket = io.connect();

var sidebar_order = [];
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

function acceptanceClick(index){
  var name = sidebar_order[index].name;
  $.post("/users/home/activeOrders/accepted", {"name": name}, function(data) {
    if (data.error) {
      confirm(data.msg);
    } else {
      var li = document.getElementById('lastClicked');
      li.remove();
      document.location.reload();
    }
  });


  
  //
  // $('#updatesList').append('<a href="#" class="list-group-item">' +
  // '<span class="badge"><button onclick = delivered(this) class = "btn btn-primary btn-xs">Delivered</button></span>'+name+'</a>');



  


}


/**
* Add order to open orders sidebar
* @param order order object to add
*/
function addToSidebar(order) {
  var sidebar_table = '<table class="table table-bordered">'+
                '<tbody>'+
                '<tr>'+
                '<td> price </td>'+
                '<td>'+order.cost+'</td>'+
                '</tr>'+
                '<tr>'+
                '<td> tip </td>'+
                '<td>'+order.tip+'</td>'+
                '</tr>'+
                '</table>';
                
  var sidebar = $('<li>')
      .attr("data-index", sidebar_order.length)
      .append(order.restaurant)
      .append(sidebar_table)
      .addClass('open-orders')
      .addClass('test');
      sidebar_order.push(order);
  
  // sidebar.click(function() {		
  //   $('.open-orders').popover('hide');		
  //   sidebar.popover('toggle', {		
  //     html: true,		
  //     trigger: 'click focus',		
  //     placement: 'right',
  //     container: 'body'
  //   });
  // });
  
  $('#sidebar').prepend(sidebar);
  
  // sidebar.popover({
  //   html: true,
  //   trigger: 'focus click',
  //   placement: 'right',
  //   container: 'body',
  //   template: '<div class="popover open-orders-popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  // });
  
  // $("body").on("click",".open-orders",function(){
  //       // $(this).popover();
        
        
        
  //       $(".open-orders").not(this).popover("hide"); //hide other popovers
  //       return false;
  //   });
  //   $("body").on("click",function(){
  //       $(".open-orders").popover("hide"); //hide all popovers when clicked on body
  //   });


  $('li').click(function(){
    
    if(clicked === false){
      $(this).attr('id','lastClicked');
      clicked = true;
    }else{
      
      $('#lastClicked').removeAttr('id');
      $(this).attr('id','lastClicked');
      
    }
    var index = this.dataset.index;
    var data = sidebar_order[parseInt(index)];
    var table = ""+
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
                '<td> tip </td>'+
                '<td>'+data.tip+'</td>'+
                '</tr>'+
                '</tbody>'+
                '</table>';
    if (deliveryboy_type)
                table += '<button class="btn btn-primary" onclick="acceptanceClick('+index+')">Deliver Me</button>';
    
    $("#infobox-body").empty();
    $("#infobox-title").addClass("text-center");
    $("#infobox-body").addClass("text-center");
    $("#infobox-body").append(table);
    $("#infobox").modal("show");

  });


}

$.get('/order/activeOrders',function(order){


  for(var i =0;i<order.length;i++){


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
