/// <reference path="../../Vendors/angular.min.js" />

angular.module('services.global', ['services.appconstant'])
    .factory('GlobalSvc', function (AppConstant) {
        var service = {
            getApiUrl: function (entity, version) {
                var url = (version === undefined ? AppConstant.apiv2 : AppConstant.apiv1) + entity;
                return url;
            },
            changeTitle: function (title) {
                if (title) {
                    document.title = title;
                } else {
                    return document.title;
                }
            }
        };
        return service;
    });
