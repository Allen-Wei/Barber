/// <reference path="../Vendors/jquery-2.1.3.min.js" />
/// <reference path="../Vendors/amplify-vsdoc.js" />

window.Utils = {
};
$.eAjax = function () {
    var baseOption = {
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json'
    };
    var option = undefined;
    if (arguments.length == 1) {
        //$.eAjax(option);
        option = arguments[0];
    }
    if (arguments.length >= 2) {
        //$.eAjax(url, method, data);
        option = {
            url: arguments[0],
            type: arguments[1]
        };
        if (arguments[2]) {
            option.data = JSON.stringify(arguments[2]);
        }
    }
    if (option == undefined) { throw 'error_parameters'; }
    $.extend(baseOption, option);

    return $.ajax(baseOption);
};
