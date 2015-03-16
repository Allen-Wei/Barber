//require jquery ui

angular.model('directives.selectDate').directive('selectDate', function ($rootScope) {
    return {
        restrict: 'EA',
        scope: { minDate: '=minDate', maxDate: '=maxDate', dateFormat: '@dateFormat' },
        link: function (scope, iele, iattrs) {
            var $ele = $(iele);
            $ele.prop('readonly', true);
            $ele.css({ 'cursor': 'pointer' });
            var parameters = {};
            if (scope.minDate) {
                parameters.minDate = scope.minDate;
            }
            if (scope.maxDate) {
                parameters.maxDate = scope.maxDate;
            }
            if (scope.dateFormat) {
                parameters.dateFormat = scope.dateFormat;
            }
            $ele.datepicker(parameters);

        }
    };
});