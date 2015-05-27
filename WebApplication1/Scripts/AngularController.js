var socialNetwork = angular.module("socialNetworkApp", ["ngRoute"]);

socialNetwork.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", { templateUrl: "/Partials/LoginAndRegister.html" })
});

socialNetwork.controller("SocialNetworkController", function($scope) {
    Init();

    function Init() {
        var token = getCookie("access_token");
        $scope.isLogedIn = (token != "");
    }

    $scope.tryLogin = function() {
        var username = $("#login-username").val();
        var password = $("#login-password").val();
        $.post(backEndURL + "/api/users/Login", { Username: username, Password: password }, function (data) {
            if (typeof (data) !== undefined) {
                //console.log(new Date(data.expires_in));
                document.cookie = "access_token=" + data.access_token;
                //console.log(document.cookie);
                $scope.isLogedIn = true;
                $scope.$apply();
            }
        }).fail(function () {
            $scope.loginErrorMessage = "Wrong username or password!";
            $scope.$apply();
        });
    }
});