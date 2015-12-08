var addressForm = document.getElementById('autocomplete2');
var menuButton = document.getElementById('menuButton');
var todaysMenu = '';
var tableTitle = '<h3>Todays Menu</h3>';
var tmp = $.fn.popover.Constructor.prototype.show;
$.fn.popover.Constructor.prototype.show = function () {
  tmp.call(this);
  if (this.options.callback) {
    this.options.callback();
  }
};


function loadMenu(){
todaysMenu = '';
todaysMenu = '<table class="table table-condensed"><thead><tr><th>Item</th><th>Cost</th></tr></thead><tbody><tr>';
  if(addressForm.value.length > 0){
    tableTitle = '<h3>Todays Menu</h3>';

    var address = addressForm.value;

      $.get('/order/getDishes', function(dishes){

        for(var i in dishes){

          if(dishes[i].address === address){
            todaysMenu += '<td>' +dishes[i].name+ '</td><td>'+dishes[i].price+ '</td>';
          }
        }

        todaysMenu += '<tr/></tbody></table>';


      });

  }else{

    tableTitle = '<h3>Please Enter a Restaurant</h3>';

  }
}


  $('[data-toggle="popover"]').popover({
    //callback: function(){loadMenu();},
    trigger: 'hover',
    title: function(){
      return tableTitle;
    },
          content: function(){
            return todaysMenu;
          },
          html: true

  });

window.setInterval(function(){
  loadMenu();
}, 3000);
