

var orderButton = document.getElementById('placeOrder');

var user = {
    'name': '',
    'address': '',
    'restaurant': ''
};

//create user login based on their facebook and save addresses, restaurants, orders etce

orderButton.onclick = function() {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            
            user.name = document.getElementById('name').value;
            user.address = document.getElementById('address').value;
            user.restaurant = document.getElementById('restaurant').value;
            
            
            //Send to server process, save user into database
            //$.get('processOrder',order);

        }
    });
}
