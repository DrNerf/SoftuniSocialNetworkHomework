function tryLogin() {
    var username = $("#login-username").val();
    var password = $("#login-password").val();
    $.post(backEndURL + "/api/users/Login", { Username: username, Password: password }, function (data) {
        console.log(data);
    });
}

$('#registerForm')
    .ajaxForm({
        url: 'http://softuni-social-network.azurewebsites.net/api/users/Register', 
        dataType: 'json',
        //method: 'post',
        success: function (response) {
            console.log(response);
        }
    });