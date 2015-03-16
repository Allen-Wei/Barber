angular.module('filters.toShortDate', []).filter('toShortDate', function () {
    return function (date) {
        if (date) {
            return (date.getMonth() + 1) + '/' + date.getDate() + '/' + (date.getYear() + 1900);
        } else {
            return date;
        }
    }
});