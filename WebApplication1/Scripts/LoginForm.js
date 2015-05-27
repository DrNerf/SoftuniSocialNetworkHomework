function tryLogin() {
    var username = $("#login-username").val();
    var password = $("#login-password").val();
    $.post(backEndURL + "/api/users/Login", { Username: username, Password: password }, function (data) {
        if (typeof (data) !== undefined) {
            //console.log(new Date(data.expires_in));
            document.cookie = "access_token=" + data.access_token;
            //console.log(document.cookie);
        }
    }).fail(function () {
        $("#LoginErrorMessage").text("Wrong username or password!");
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