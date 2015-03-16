/// <reference path="../../Vendors/angular.min.js" />

angular.module('services.message', [])
    .factory('MessageSvc', function ($http, AppConstant) {
        var service = {

            getApi: function (append) {
                return AppConstant.getApi({
                    url: '/Api/Message',
                    params: append
                });
            },

            getUnreadCount: function () {
                return $http({
                    method: 'GET',
                    url: this.getApi()
                });
            },
            getAll: function (page) {
                var take = AppConstant.perPage;
                var skip = (page - 1) * take;
                var promise = $http({
                    method: 'get',
                    url: this.getApi(),
                    params: { take: take, skip: skip }
                });
                return promise;
            },
            getList: function (page, isRead) {
                var take = AppConstant.perPage;
                var skip = (page - 1) * take;
                var promise = $http({
                    method: 'get',
                    url: this.getApi(),
                    params: { isRead: !!isRead, take: take, skip: skip }
                });
                return promise;
            },
            setRead: function (messages) {
                if (messages.length) {
                    return $http({
                        method: 'POST',
                        url: this.getApi(),
                        data: messages
                    });
                }
                if (typeof (messages) == 'number') {
                    return $http({
                        method: 'POST',
                        url: this.getApi(messages)
                    });
                }
                throw 'Error parameters at services.message.js -> setRead';
            }
        };
        return service;
    });
