/// <reference path="../../Vendors/angular.min.js" />

angular.module('services.search', [])
    .factory('SearchSvc', function ($http, AppConstant) {
        var service = {

            getApi: function (fnName, append) {
                return AppConstant.getApi({
                    url: '/Apiv1/Search/' + fnName,
                    params: append
                });
            },

            searchTag: function (q, page) {
                var takeSkip = AppConstant.getTakeSkip(page);
                takeSkip.q = q;

                return $http({
                    url: this.getApi('SearchTag', takeSkip)
                });
            }
        };
        return service;
    });
