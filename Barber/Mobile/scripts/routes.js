/// <reference path="../../Vendors/angular.min.js" />
/// <reference path="../../Vendors/jquery-2.1.3.min.js" />
/// <reference path="~/Vendors/amplify.min.js" />

(function () {
    var getPath = function (name) {
        return '/Mobile/templates/' + name + '.html';
    };
    angular.module('mobile.routes', ['ngRoute']).config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: getPath('home'),
            controller: 'HomeCtrl'
        }).when('/sign/:mode', {
            templateUrl: getPath('sign'),
            controller: 'SignCtrl'
        }).when('/user', {
            templateUrl: getPath('user'),
            controller:'UserCtrl'
        }).when('/person/:id', {
            templateUrl: getPath('person'),
            controller: 'PersonCtrl'
        }).when('/signout', {
            templateUrl: getPath('signout'),
            controller:'SignOutCtrl'
        }).when('/message', {
            templateUrl: getPath('message'),
            controller:'MessageCtrl'
        }).when('/profile/update', {
            templateUrl: getPath('profile.update'),
            controller:'ProfileUpdateCtrl'
        }).otherwise('/');
    });

})();