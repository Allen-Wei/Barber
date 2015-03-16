/// <reference path="~/Vendors/angular.min.js" />
/// <reference path="../../Vendors/amplify-vsdoc.js" />
/// <reference path="../Utils.js" />
/// <reference path="~/Vendors/jquery-2.1.3.min.js" />

var app = angular.module('BarberApp', [
    'services.global',
    'services.appconstant',
    'services.tip',
    'services.user'
]);
app.controller('BodyCtrl', function ($scope) {
});
app.controller('RegisterCtrl', function ($scope, UserSvc, TipSvc) {
    $scope.main = {
        user: {
            UserCode: '',
            Password: '',
            Repeat: '',
            Name: '',
            Gender: 'male',
            Address: '',
            Age: '',
            Signature: '',
            UserType: 'Barber',
            Barberer: {
                ShopName: ''
            }
        },
        register: function () {
            UserSvc.register(this.user).then(function (rep) {
                if (rep.data && rep.data.Success) {
                    TipSvc.toTip('注册成功!');
                    amplify.publish('success.register.user');
                } else {
                    TipSvc.toTip('注册失败: ' + rep.data.Brief);
                    amplify.publish('fail.register.user', rep.data.Brief, rep.data.Message);
                }
            });
        }
    };
});