import filterize from 'filterize-canvas';

import toolBoxController from 'toolBoxController';
import filterSelectionController from 'filterSelectionController';

import filterService from 'filterService';

window.filterize = filterize;

angular.module('filterize', [])
.controller('filterSelectionController', filterSelectionController)
.controller('toolBoxController', toolBoxController)
.service('filterService', filterService)
.directive('toolBox', function() {
    return {
        restrict: 'E',
        templateUrl: 'tpls/toolBox.tpl.html',
        controller: 'toolBoxController'       
    }
})
.directive('filterSelection', () => {
    return {
        restrict: 'E',
        templateUrl: 'tpls/filterSelection.tpl.html',
        controller: 'filterSelectionController'
    };
})
.run(function($window, $rootScope, filterService) {


});

