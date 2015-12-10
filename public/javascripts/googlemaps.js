// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

var placeSearch, autocomplete1, autocomplete2, inputAddress, inputRestaurantname;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  if (document.getElementById('autocomplete')) {
    autocomplete1 = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {types: ['geocode']});
    autocomplete1.addListener('place_changed', fillInAddress(autocomplete1));
    console.log(autocomplete1);
  }
  if (document.getElementById('autocomplete2')) {
     autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('autocomplete2'));
     autocomplete2.addListener('place_changed', fillInAddress(autocomplete2));
     console.log(autocomplete2);
  }
  if (document.getElementById('inputAddress')) {
       inputAddress = new google.maps.places.Autocomplete(document.getElementById('inputAddress'),{types: ['establishment']});
       inputAddress.addListener('place_changed', fillInAddress(inputAddress));
       console.log(inputAddress);
  }

  // if (document.getElementById('inputRestaurantname')) {
  //     inputRestaurantname = new google.maps.places.Autocomplete(document.getElementById('inputRestaurantname'),{types: ['establishment']});
  //     inputRestaurantname.addListener('place_changed', fillInAddress(inputRestaurantname));
  //     console.log(inputRestaurantname);
  // }




  // When the user selects an address from the dropdown, populate the address
  // fields in the form.






  //initAutocomplete2();
}

// [START region_fillform]
function fillInAddress(autocompleteComp) {
  // Get the place details from the autocomplete object.
  var place = autocompleteComp.getPlace();
  console.log("in fillInAddress", place);
  // for (var component in componentForm) {
  //   if (component == null)
  //     continue;
  //     console.log(component);
  //   document.getElementById(component).value = '';
  //   document.getElementById(component).disabled = false;
  // }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  // for (var i = 0; i < place.address_components.length; i++) {
  //   var addressType = place.address_components[i].types[0];
  //   if (componentForm[addressType]) {
  //     var val = place.address_components[i][componentForm[addressType]];
  //     document.getElementById(addressType).value = val;
  //   }
  // }
}
// [END region_fillform]

// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  console.log("on click");
  if (navigator.geolocation) {
    console.log("navigation available");
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log("current position");
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

// [END region_geolocation]
