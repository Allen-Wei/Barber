/// <reference path="../../Vendors/angular.min.js" />

angular.module('directives.topTip', ['services.tip']).directive('topTip', function (TipSvc) {
    return {
        restrict: 'EA',
        scope: {},
        replace: true,
        template: '<div class="tip text-warning ng-hide" ng-show="myTip.show" ng-class="{hide:!myTip.show, animated:myTip.show, bounceInDown: myTip.show }" ng-bind="myTip.text"></div>',
        link: function (scope, iEle, iAttrs) {
            scope.myTip = TipSvc;
        }

    };
});
