/// <reference path="../../Vendors/angular.min.js" />
angular.module('services.appconstant', [])
    .constant('AppConstant', {
        ngDateFormat: 'yyyy-MM-dd',
        ngDateFormatDetail: 'yyyy-MM-dd HH:mm:ss',
        uiDateFormat: 'yy-mm-dd',
        perPageLittle: 5,
        perPage: 10,
        perPageLarge: 50,

        getApi: function (inOptions) {
            var options = {
                url: undefined,
                version: 1,
                entity: 'api entity',

                params: undefined //{para: value} append with get params
            };
            $.extend(options, inOptions);
            var apiUrl = '/APIv' + options.version + '/' + options.entity;
            if (options.url) { apiUrl = options.url; }
            if (options.params) {
                if ($.isPlainObject(options.params)) {
                    apiUrl += '?' + $.param(options.params);
                } else {
                    apiUrl += '/' + options.params;
                }
            }
            return apiUrl;
        },
        getTakeSkip: function (page, perPageNumber) {
            var take = perPageNumber || this.perPage;
            var skip = (page - 1) * take;
            return { take: take, skip: skip };
        }
    });
