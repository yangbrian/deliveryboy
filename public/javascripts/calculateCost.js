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

var orderEntry = $('#table-new-orders');
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

      //orderEntry.val(
      //    (orderEntry.val() == '' ?  '' : (orderEntry.val() + '\n')) +
      //    '- ' + $(this).find('.menu-item-name').html()
      //);

      orderCost.val(
          (Number(orderCost.val()) + Number($(this).find('.menu-item-price').html())).toFixed(2)
      );

      var itemName = $(this).find('.menu-item-name').html();
      var itemPrice = Number($(this).find('.menu-item-price').html()).toFixed(2);
      var newRow = $('<tr>')
          .append($('<td>').html(itemName))
          .append($('<td>').html(itemPrice))
          .attr('data-item', itemName)
          .attr('data-price', itemPrice)
          .attr('data-toggle', 'tooltip')
          .attr('data-placement', 'right')
          .attr('title', 'Click to delete item')
          .addClass('new-order-entry');

      orderEntry.append(newRow);

      newRow.tooltip();
      updateTotal();
    });
  }


  $('.menu-popover-content').append(todaysMenu);
  $('#menu-loader').fadeOut();

}

orderEntry.on('click', '.new-order-entry', function () {
  $(this).addClass('delete');
  $(this).fadeOut(300, function () {
    $(this).remove();
  });

  $('.tooltip').remove();

  orderCost.val(
      (Number(orderCost.val()) - Number($(this).attr('data-price'))).toFixed(2)
  );

  updateTotal();

});


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

$('input:radio').on('change', updateTotal);

function updateTotal() {
    newCost = document.getElementById('cost').value;

  var isChecked =document.querySelector('input[name="tip"]:checked');

  if (isChecked !== null) {
    var tip = $('input[name="tip"]:checked').val();;

    var tipPercent = 1 + parseFloat(tip/100, 10);
    var cost = parseFloat(newCost, 10);
    var total = tipPercent * cost;

    document.getElementById('total-cost').innerHTML = total.toFixed(2);

    $('#total-cost-field').val(total.toFixed(2));

  }
}

$('#customTip').on('keyup', function () {
  $('#customTipValue').val($(this).val());
  updateTotal();
});

$('#cost').val('0.00');
