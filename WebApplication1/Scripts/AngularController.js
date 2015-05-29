var socialNetwork = angular.module("socialNetworkApp", ["ngRoute"]);

socialNetwork.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", { templateUrl: "/Partials/LoginAndRegister.html" })
        .when("/viewProfile", { templateUrl: "/Partials/ViewProfile.html" })
});

socialNetwork.controller("SocialNetworkController", function($scope) {
    init();
    if ($scope.isLogedIn) {
        initProfile();
    }

    function init() {
        var token = getCookie("access_token");
        $scope.isLogedIn = (token != "");
    }

    function initProfile() {
        getPersonalData();
        //createNewPost();
        getNewsFeed();
    }

    $scope.tryLogin = function() {
        var username = $("#login-username").val();
        var password = $("#login-password").val();
        $.post(backEndURL + "/users/Login", { Username: username, Password: password }, function (data) {
            if (typeof (data) !== undefined) {
                //console.log(new Date(data.expires_in));
                document.cookie = "access_token=" + data.access_token;
                //console.log(document.cookie);
                $scope.isLogedIn = true;
                initProfile();
                $scope.$apply();
            }
        }).fail(function () {
            $scope.loginErrorMessage = "Wrong username or password!";
            $scope.$apply();
        });
    }

    $scope.logout = function () {
        $.ajax({
            url: backEndURL + "/users/Logout",
            type: "POST",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                console.log(data);
                deleteCookie("access_token");
                deleteCookie("nickname");
                $scope.isLogedIn = false;
                $scope.$apply();
            }
        });
    }

    $scope.search = function (terms) {
        $.ajax({
            url: backEndURL + "/users/search?searchTerm=" + terms,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                console.log(data);
                $scope.searchResults = data;
                $scope.$apply();
            }
        });
    }

    $scope.user = function (username) {
        $scope.searchResults.length = 0;
        $.ajax({
            url: backEndURL + "/users/" + username,
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                console.log(data);
                $scope.profileViewed = data;
                $scope.$apply();
                window.location.href = "/#/viewProfile";
            }
        });
    }

    function getPersonalData() {
        $.ajax({
            url: backEndURL + "/me",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                //console.log(data);
                $scope.fullName = data.name;
                document.cookie = "nickname=" + data.username;
                $scope.$apply();
            }
        });
    }

    function getNewsFeed() {
        $.ajax({
            url: backEndURL + "/me/feed?PageSize=10",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                $scope.newsFeed = data;
                $scope.$apply();
                console.log($scope.newsFeed);
            }
        });
    }

    function createNewPost() {
        //console.log(getCookie("nickname"));
        $.ajax({
            url: backEndURL + "/Posts",
            type: "POST",
            data: { PostContent: "WAAZAAA", Username: getCookie("nickname") },
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                console.log(data);
            }
        });
    }

    $scope.parseGender = function(number) {
        if (number == 1) {
            return "Male";
        }
        if (number == 2) {
            return "Female";
        }
        return "Other";
    }
});