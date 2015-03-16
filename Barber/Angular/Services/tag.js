/// <reference path="../../Vendors/angular.min.js" />

angular.module('services.tag', [])
    .factory('TagSvc', function ($http, AppConstant) {
        var service = {

            getApi: function (append) {
                return AppConstant.getApi({
                    url: '/Api/Tag',
                    params: append
                });
            },
            getList: function (id) {
                var url = this.getApi(); //get current user skills
                if (id) { url = this.getApi(id); /*get special user skills*/ }

                var promise = $http({
                    method: 'get',
                    url: url
                });
                return promise;
            },


            add: function (tag) {
                var entity = { TagName: tag };
                var promise = $http({
                    method: 'PUT',
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
