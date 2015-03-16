/// <reference path="../../Vendors/angular.min.js" />

angular.module('services.tweet', [])
    .factory('TweetSvc', function ($http, AppConstant) {
        var service = {

            getApi: function (append) {
                return AppConstant.getApi({
                    url: '/Api/Tweet',
                    params: append
                });
            },
            get: function (id) {
                var promise = $http({
                    method: 'get',
                    url: this.getApi(id)
                });
                return promise;
            },

            getList: function (page, user) {
                var take = AppConstant.perPage;
                var skip = (page - 1) * take;
                var params = { take: take, skip: skip };
                if (user) {
                    params.user = user;
                }
                var promise = $http({
                    method: 'get',
                    url: this.getApi(),
                    params: params
                });
                return promise;
            },
            add: function (content) {
                var entity = { Content: content };
                var promise = $http({
                    method: 'PUT',
                    url: this.getApi(),
                    data: entity
                });
                return promise;
            },
            update: function (entity) {
                var promise = $http({
                    method: 'POST',
                    url: this.getApi(),
                    data: entity
                });
                return promise;
            },
            remove: function (id) {
                var promise = $http({
                    method: 'delete',
                    url: this.getApi(id)
                });
                return promise;
            }
        };
        return service;
    });
