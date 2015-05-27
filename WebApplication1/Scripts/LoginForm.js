

$('#registerForm')
    .ajaxForm({
        url: 'http://softuni-social-network.azurewebsites.net/api/users/Register', 
        dataType: 'json',
        //method: 'post',
        success: function (response) {
            console.log(response);
        }
    });