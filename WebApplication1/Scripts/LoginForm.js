$("#registerForm").ready(function () {
    var ajaxform = $('#registerForm').ajaxForm(function(data) {
        console.log(data);
    });
});