var socialNetwork = angular.module("socialNetworkApp", ["ngRoute"]);

socialNetwork.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when("/", { templateUrl: "/Partials/LoginAndRegister.html" })
});

socialNetwork.controller("SocialNetworkController", function($scope) {
    
});