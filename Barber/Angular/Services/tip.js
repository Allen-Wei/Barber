/// <reference path="../../Vendors/angular.min.js" />
angular.module('services.tip', []).factory('TipSvc', function ($timeout) {
    var service = {
        show: false,
        text: '',
        duration: function (txt, time) {
            this.toShow(txt);
            $timeout(function () {
                service.toHide();
            }, time || 2000);
        },
        toTip: function (txt) {
            this.show = true;
            this.text = txt;
        },
        toHide: function () {
            this.show = false;
            this.text = '';
        }
    };
    return service;
});