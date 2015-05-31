var socialNetwork = angular.module("socialNetworkApp", ["ngRoute"]);

socialNetwork.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", { templateUrl: "/Partials/LoginAndRegister.html" })
        .when("/viewProfile", { templateUrl: "/Partials/ViewProfile.html" })
        .when("/editProfile", { templateUrl: "/Partials/EditProfile.html" })
        .when("/changePassword", { templateUrl: "/Partials/ChangePassword.html" })
        .when("/createPost", { templateUrl: "/Partials/CreatePost.html" })
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
        getFriendRequests();
        getFriends();
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
                $scope.email = data.email;
                $scope.gender = data.gender;
                $scope.nameForEdit = data.name;
                $scope.emailForEdit = data.email;
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

    $scope.createNewPost = function(content) {
        //console.log(getCookie("nickname"));
        $.ajax({
            url: backEndURL + "/Posts",
            type: "POST",
            data: { PostContent: content, Username: getCookie("nickname") },
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                console.log(data);
                alert("Post created!");
                window.location.href = "/#/";
            },
            error: function () {
                alert("Invalid data!");
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

    $scope.friendRequest = function (username) {
        $.ajax({
            url: backEndURL + "/me/requests/" + username,
            type: "POST",
            data: { username: username },
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                console.log(data);
            }
        });
    }

    function getFriendRequests() {
        $.ajax({
            url: backEndURL + "/me/requests",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                console.log(data);
                $scope.friendRequests = data;
                $scope.$apply();
            }
        });
    }

    $scope.resolveFriendRequest = function (id, status) {
        $.ajax({
            url: backEndURL + "/me/requests/" + id +"?status=" + status,
            type: "PUT",
            data: { requestId: id, status: status },
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                console.log(data);
            }
        });
    }

    $scope.updateProfile = function () {
        $.ajax({
            url: backEndURL + "/me/",
            type: "PUT",
            data: { Name: $scope.nameForEdit, Email: $scope.emailForEdit },
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                console.log(data);
            }
        });
    }

    $scope.changePassword = function (oldPassword, newPassword, confirmPassword) {
        $.ajax({
            url: backEndURL + "/me/ChangePassword",
            type: "PUT",
            data: { OldPassword: oldPassword, NewPassword: newPassword, ConfirmPassword: confirmPassword },
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                console.log(data);
                alert(data.message);
            },
            error: function (data) {
                alert("Invalid data!");
            }
        });
    }

    $scope.likePost = function(id, type){
        $.ajax({
            url: backEndURL + "/Posts/" + id + "/likes",
            type: type,
            data: { id: id },
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                console.log(data);
                getNewsFeed();
            }
        });
    }

    function getFriends() {
        $.ajax({
            url: backEndURL + "/me/friends",
            type: "GET",
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie("access_token")); },
            success: function (data) {
                console.log(data);
                $scope.friends = data;
                $scope.$apply();
            }
        });
    }
});