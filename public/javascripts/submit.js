var socket = io();
var orderButton = document.getElementById('placeOrder');


var user = {
    name: '',
    address: '',
    restaurant: '',
    order: '',
    cost: '',
    tip: ''
};

//create user login based on their facebook and save addresses, restaurants, orders etce

orderButton.onclick = function() {

    
       console.log("TESTING");
    
           
            user.name = document.getElementById('name').value;
            user.address = document.getElementById('autocomplete').value;
            user.restaurant = document.getElementById('autocomplete2').value;
            user.order = document.getElementById('order').value;
            user.cost = document.getElementById('cost').value;
            var ison =  document.querySelector('input[name="tip"]:checked').value;
            var checkedTip = document.querySelector('input[name="tip"]:checked').parentNode;
            
            if (checkedTip.id === 'custom') {
                
                user.tip = document.getElementById('customTip').value;
                

            }
            else {
                user.tip = checkedTip.innerHTML;
                user.tip = user.tip.slice(user.tip.lastIndexOf(' '), user.tip.length-1);


            }
            
            //
            socket.emit('order',user);
          
   
}



