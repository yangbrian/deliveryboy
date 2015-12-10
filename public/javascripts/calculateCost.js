var addressForm = document.getElementById('autocomplete2');
var menuButton = document.getElementById('menuButton');
var todaysMenu;
var tableTitle = '<h3>Today\'s Menu</h3>';
var tmp = $.fn.popover.Constructor.prototype.show;
$.fn.popover.Constructor.prototype.show = function () {
  tmp.call(this);
  if (this.options.callback) {
    this.options.callback();
  }
};

var orderEntry = $('#order');
var orderCost = $('#cost');

/**
 * Load menus and display into popover dialog
 */
function loadMenu(){

  var todaysMenu;
  if (addressForm.value == '') {
    todaysMenu = $('<p>')
        .html('Please enter a restaurant name');
  } else {
    todaysMenu = $('<table>')
        .addClass('table table-condensed table-hover popover-menu-table')
        .append(
            $('<thead>')
                .append(
                    $('<tr>')
                        .append($('<th>').html('Item'))
                        .append($('<th>').html('Cost'))
                )

        );

    $.get('/order/getDishes', function (dishes) {

      var count = 0;
      $.each(dishes, function (index, dish) {
        if (dish.address === addressForm.value) {
          todaysMenu.append($('<tr>')
              .addClass('menu-popover-row')
              .append(
                  $('<td>')
                      .addClass('menu-item-name')
                      .html(dish.name)
              )
              .append(
                  $('<td>')
                      .addClass('menu-item-price')
                      .html(dish.price)
              )
          );
          count++;
        }
      });

      if (count == 0) {
        todaysMenu = $('<p>')
            .html('Please enter a restaurant name');
      }
    });

    // add order to list of items and add to the total cost
    $('.menu-popover').on('click', '.menu-popover-row', function () {

      orderEntry.val(
          (orderEntry.val() == '' ?  '' : (orderEntry.val() + '\n')) +
          '- ' + $(this).find('.menu-item-name').html()
      );

      orderCost.val(
          (Number(orderCost.val()) + Number($(this).find('.menu-item-price').html())).toFixed(2)
      );
    });
  }


  $('.menu-popover-content').append(todaysMenu);
  $('#menu-loader').fadeOut();

}


$('#menuButton').popover({
  callback: function(){
      loadMenu();
  },
  content: '<div class="spinner" id="menu-loader"><div class="double-bounce1"></div> <div class="double-bounce2"></div></div>',
  trigger: 'click focus',
  title: function(){
    return tableTitle;
  },
  html: true,
  template: '<div class="popover menu-popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content menu-popover-content"></div></div>',
  placement: 'bottom' // have to put on bottom because menu is inserted dynamically

});
