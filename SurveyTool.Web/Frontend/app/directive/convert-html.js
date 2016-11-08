'use strict';
angular.module('mainApp').filter("convertHtml", ['$sce', function ($sce) {
    return function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    }
}]);