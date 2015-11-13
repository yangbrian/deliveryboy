

var orderButton = document.getElementById('placeOrder');

var user = {
    'name': '',
    'address': '',
    'restaurant': '',
    'order':'',
    'cost':'',
    'tip':''
};

//create user login based on their facebook and save addresses, restaurants, orders etce

orderButton.onclick = function() {
   
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            
            user.name = document.getElementById('name').value;
           user.address = document.getElementById('autocomplete').value;
            user.restaurant = document.getElementById('autocomplete2').value;
            user.order = document.getElementById('order').value;
            user.cost = document.getElementById('cost').value;
            
             var tip = document.querySelector('input[name="tip"]:checked').parentNode;
             if(tip.id==='custom'){
                 tip = document.getElementById('customTip').value;
                 
             }else{
                tip = tip.innerHTML;
                tip = tip.slice(tip.lastIndexOf(' '),tip.length);
                
                
             }
             
             console.log(user);
             
            
        }
        
        // $.post('submitOrder',{'user':user},function(){
        //     console.log(window.location.href);
            
        // });
    });
}
