/// <reference path="~/Vendors/angular.min.js" />
/// <reference path="../../Vendors/amplify-vsdoc.js" />
/// <reference path="../Utils.js" />
/// <reference path="~/Vendors/jquery-2.1.3.min.js" />


var app = angular.module('ProfileApp', [
    'ngRoute',
    'directives.topTip',
    'services.global',
    'services.appconstant',
    'services.tip',

    'services.user',
    'services.tweet',
    'services.tag',
    'services.skill',
    'services.comment',
    'services.reserve'
]);
app.config(function ($routeProvider) {
    var getPath = function (templateName) {
        return '/temp.users.profile.' + templateName + '.ng';
    };
    $routeProvider.when('/', {
        templateUrl: getPath('Basic'),
        controller: 'BasicCtrl'
    }).otherwise('/');
});
app.controller('BodyCtrl', function ($scope, AppConstant, TipSvc) {
    $scope.constant = AppConstant;
});
app.controller('BasicCtrl', function ($scope, TipSvc, UserSvc) {

    $scope.main = {
        user: {},
        refresh: function () {
            var thes = this;
            UserSvc.get().then(function (rep) {
                if (rep.data && rep.data.Success) {
                    thes.user = rep.data.Result;
                } else {
                }
            });
        }
    };
    $scope.main.refresh();
});

