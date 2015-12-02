function clearAlert() {
    console.log("clear alert");
    var alert = document.getElementById("alert-pane");
    setTimeout(function () {
        $("#alert-pane").fadeOut(3000, function () {
            alert.parentNode.removeChild(alert);
        });
    }, 2000);
}

function bodyOnload() {
    console.log("body onload");
    if ($("#alert-pane"))
        clearAlert();
        
    $('#tags').inputTags({
        minLength:1,
        errors: {
            empty: "Attention, a tag should contain at least one character"
        }
    });
}