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

var taxDisplay = $('#tax');
var taxLoad = $('#tax-loader');
var taxRateDisplay = $('#tax-rate');

// keeps track of current tax rate for input zip code
var taxRate = 0;

var newItemModal = $('.modal-add-item');

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



      var itemName = $(this).find('.menu-item-name').html();
      var itemPrice = Number($(this).find('.menu-item-price').html()).toFixed(2);
      addNewItem(itemName, itemPrice);
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

  orderCost.text(
      (Number(orderCost.text()) - Number($(this).attr('data-price'))).toFixed(2)
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

function addNewItem(itemName, itemPrice) {
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

  orderCost.text(
      (Number(orderCost.text()) + Number(itemPrice)).toFixed(2)
  );

  newRow.tooltip();
  updateTotal();
}

function updateTotal() {


  newCost = $('#cost').text();

  var salesTax = newCost * (taxRate / 100);

  taxDisplay.text(salesTax.toFixed(2));
  taxRateDisplay.text(taxRate.toFixed(3));

  var tip = $('input[name="tip"]:checked').val();

  var tipPercent = 1 + parseFloat(tip/100, 10);
  var cost = parseFloat(newCost, 10);
  var total = tipPercent * cost;

  total += salesTax;

  $('#total-cost').text(total.toFixed(2));

  $('#total-cost-field').val(total.toFixed(2));


}

$('#custom-tip').on('keyup', function () {
  $('#customTipValue').val($(this).val());
  updateTotal();
});

var zip;


$('#zipcode').on('keyup', function () {
  if ($(this).val().length == 5 && $(this).val() != zip) {
    zip = $(this).val();

    taxDisplay.hide();
    taxLoad.show();

    $.get('https://taxrates.api.avalara.com/postal?country=usa&postal=' + zip + '&apikey=fbRSYkZkl%2FxcK9xQ1d71DTrfJRgOZ3U9S0yBdyaBf0yMVPFoIHQGl8RPPuiaHSWOJPvCjvLIScPQp7lG%2Blo9jQ%3D%3D', function (data) {

      taxRate = data.totalRate;
      taxLoad.hide();
      taxDisplay.show();
      updateTotal();

    })

  } else if ($(this).val().length < 5) {
    taxRate = 0;
    zip = $(this).val();
    updateTotal();
  }
});

$('#cost').val('0.00');

$('#new-item-submit').click(function () {
  newItemModal.modal('hide');

  addNewItem($('#new-item-name').val(), $('#new-item-price').val());
});

newItemModal.on('show.bs.modal', function (e) {
  $('#new-item-name').val('');
  $('#new-item-price').val('');
});
