/// <reference path="../../Vendors/angular.min.js" />

angular.module('services.reserve', [])
    .factory('ReserveSvc', function ($http, AppConstant) {
        var service = {

            getApi: function (append) {
                return AppConstant.getApi({
                    url: '/Api/Reserve',
                    params: append
                });
            },

            getList: function (user, year, month, day) {
                var promise = $http({
                    method: 'GET',
                    url: this.getApi({
                        user: user,
                        year: year,
                        month: month,
                        day: day
                    })
                });
                return promise;
            },
            add: function (entity, barberUserCode) {
                if (arguments.length == 2) {
                    //var entity = { : tweetId, Content: content };
                    var promise = $http({
                        method: 'PUT',
                        url: this.getApi({ barber: barberUserCode }),
                        data: entity
                    });
                    return promise;
                }
                if (arguments.length == 1) {
                    return $http({
                        method: 'PUT',
                        url: this.getApi(),
                        data:entity
                    });
                }
                throw 'Error parameters';
            },
            remove: function (id) {
                var promise = $http({
                    method: 'delete',
                    url: this.getApi(id)
                });
                return promise;
            },
            getCountPerDay: function (user, month, year) {
                return $http({
                    method: 'get',
                    url: this.getApi({
                        user: user, month: month, year: year
                    })
                });
            }
        };
        return service;
    });
