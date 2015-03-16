/// <reference path="../../Vendors/angular.min.js" />
angular.module('services.user', [])
    .factory('UserSvc', function ($http, AppConstant) {
        var service = {

            getApi: function (append) {
                return AppConstant.getApi({
                    entity: 'User',
                    version: 1,
                    params: append
                });
            },

            login: function (userCode, userPassword) {
                var user = { UserCode: userCode, Password: userPassword };
                var promise = $http({
                    method: 'post',
                    url: this.getApi('Login'),
                    data: user
                });
                return promise;
            },
            logout: function () {
                return $http({
                    method: 'post',
                    url: this.getApi('Logout')
                });
            },
            register: function (user) {
                //check user
                var promise = $http({
                    method: 'post',
                    url: this.getApi('Register'),
                    data: user
                });
                return promise;
            },
            get: function (userCode) {
                if (userCode) {
                    return $http({
                        method: 'get',
                        url: '/Api/User/' + userCode
                    });
                } else {
                    return $http({
                        method: 'get',
                        url: this.getApi('Current')
                    });
                }
            },
            isCurrent: function (userCode, trueCallback, falseCallback) {
                this.get().then(function (rep) {
                    if (rep.data && rep.data.Success) {
                        var user = rep.data.Result;
                        if (user.UserCode == userCode) {
                            trueCallback();
                            return;
                        }
                    }
                    falseCallback();
                }, function () {
                    falseCallback();
                });
            },
            update: function (user) {
                return $http({
                    method: 'post',
                    url: '/Api/User',
                    data: user
                });
            }
        };
        return service;
    });
