var addressform = document.getElementById('autocomplete2');
var menuButton = document.getElementById('menuButton');
var address = '';

var tmp = $.fn.popover.Constructor.prototype.show;
$.fn.popover.Constructor.prototype.show = function () {
  tmp.call(this);
  if (this.options.callback) {
    this.options.callback();
  }
};


function loadMenu(){
 address = addressform.value;

$.get("/restaurants/home/menu",function(data){
  var todaysMenu = [];
  for(var i in data){

    if(data[i].address === address){
      todaysMenu = data[i].menu;
      break;
    }else{
      //Tell user no menu is available for their choice
    }
  }
  //fill in table with menu items so popover can use it.
});
}



$('[data-toggle="popover"]').popover({
  callback: function(){loadMenu();},
  trigger: 'hover',
  title: '<h3>Today\'s Menu</h3>',
        content: '<table class="table table-condensed"><thead><tr><th>Item</th><th>Cost</th></tr></thead>'+
        ' <tbody><td>Sirloin Steak</td><td>12</td> </tbody></table>',
        html: true


});
