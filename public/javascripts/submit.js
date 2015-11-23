var socket = io();


socket.on('order', function (order) {
             $('#sidebar').append('<li><a href="#">'+order.restaurant+' </a></li>');
        });
        
        
        
var orderButton = document.getElementById('placeOrder');

var user = {
    name: '',
    number: '',
    address: '',
    restaurant: '',
    order: '',
    cost: '',
    tip: ''
};

//create user login based on their facebook and save addresses, restaurants, orders etce
function validate() {
 //Checks that fields aren't empty and that cost/tip are valid numbers. Need to add checking for valid addresses
    for (var x in user) {
        if (user[x] === '') {
            alert('Please enter a value for your ' + x);
            return false;
        } else if(x === 'cost' || x === 'tip' || x === 'number'){
            
            var num = parseFloat(user[x], 10);
            var notNum = isNaN(num);
            
            if(notNum || num <= 0){
                alert('Please enter a valid ' + x);
                return false;
            }
        }
    }
    return true;
}

orderButton.onclick = function() {
    //Checks that all fields are filled

    user.name = document.getElementById('name').value;
    user.number = document.getElementById('number').value;
    user.address = document.getElementById('autocomplete').value;
    user.restaurant = document.getElementById('autocomplete2').value;
    user.order = document.getElementById('order').value;
    user.cost = document.getElementById('cost').value;

    var isChecked =document.querySelector('input[name="tip"]:checked');
    
    if (isChecked !== null) {
        var checkedTip = document.querySelector('input[name="tip"]:checked').parentNode;

        if (checkedTip.id === 'custom') {

            user.tip = document.getElementById('customTip').value;
        }
        else {
            user.tip = checkedTip.innerHTML;
            user.tip = user.tip.slice(user.tip.lastIndexOf(' '), user.tip.length - 1);

        }
    }


  
   if(validate()){
       
       $.post('/order/new',user);
       
    socket.emit('order',user);
    $('#updatesList').append('<a href="#" class="list-group-item">' +
   '<span class="badge">Just Now</span><i class="fa fa-fw fa-comment"></i>You placed your order!</a>');
   }
   
};
