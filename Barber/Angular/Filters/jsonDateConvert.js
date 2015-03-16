angular.module('filters.jsonDateConvert', []).filter('jsonDateConvert', function () {
    return function (jsonDate) {
        var dateRegex = /^\/Date\((\d+)\)\/$/;
        if (dateRegex.test(jsonDate)) {
            var splitedDate = dateRegex.exec(jsonDate);
            if (splitedDate && splitedDate.length == 2) {
                var dateNumbers = parseInt(splitedDate[1]);
                if (!isNaN(dateNumbers)) {
                    return new Date(dateNumbers);
                }
            }
        }
        return jsonDate;
    };
});