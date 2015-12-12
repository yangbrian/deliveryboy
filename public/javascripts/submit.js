
var token;
$.get('/order/client_token', function(data){

  token = data;

  alert(token);
});

braintree.setup("CLIENT-TOKEN-FROM-SERVER", "dropin", {
  container: "dropin-container",
  paypal: {
    singleUse: true,
    amount: 10.00,
    currency: 'USD'
  }
});


  // braintree.setup(token, "custom", {
  //   paypal: {
  //     container: "paypal-container",
  //   },
  //   onPaymentMethodReceived: function (obj) {
  //     doSomethingWithTheNonce(obj.nonce);
  //   }
  // });


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
    user.number = document.getElementById('phoneNumber').value;
    user.address = document.getElementById('autocomplete').value;
    user.restaurant = document.getElementById('autocomplete2').value;
    user.order = document.getElementById('order').value;
    user.cost = document.getElementById('total-cost-field').value;

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





   if(validate()) {
        console.log("validated");
       $.post('/order/new', user, function(data) {
           console.log(data);
           if (data.error) {
               var yes = confirm(data.msg);
               if (yes) {
                   document.getElementById('spin_fade').style.display='block';
                   $.post('/order/new_force',user, function(data) {
                       window.location.href = "/users/home";
                   });
               } else {
                  window.location.href = "/users/home";
               }
           } else {
                window.location.href = "/users/home";
           }
       });
   }
};

var newCost;
var count = 0;
