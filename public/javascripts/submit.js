



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
    // order: '',
    cost: '',
    tip: '',
    braintree_token: "none"
};

//create user login based on their facebook and save addresses, restaurants, orders etce
function validate() {
    //Checks that fields aren't empty and that cost/tip are valid numbers. Need to add checking for valid addresses
    user.name = document.getElementById('name').value;
    user.number = document.getElementById('phoneNumber').value;
    user.address = document.getElementById('autocomplete').value;
    user.restaurant = document.getElementById('autocomplete2').value;

    user.order = '';

    $('.new-order-entry').each(function () {
        user.order += '- ' + $(this).attr('data-item') + '\n';
    });

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
    if (validate())

        $.get('/order/client_token', function(data){
            $("#dropin-container").empty();
            var token = data;
            user.braintree_token = token;
            braintree.setup(token, "dropin", {
                container: "dropin-container",
                paypal: {
                    singleUse: true,
                    amount: user.cost,
                    currency: 'USD'
                },
                dataCollector: {
                    paypal: true  // Enables fraud prevention
                },
                onPaymentMethodReceived: function (obj) {
                    console.log(obj);
                    placeOrder();
                }
            });
            $("#paybox").modal("show");
        });

};

function placeOrder() {
    //Checks that all fields are filled

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



