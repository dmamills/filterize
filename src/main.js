import Filterize from 'filterize-canvas';

import toolBoxController from 'toolBoxController';
import filterSelectionController from 'filterSelectionController';
import fileControlsController from 'fileControlsController';
import fileUploaderController from 'fileUploaderController';

import filterService from 'filterService';

window.Filterize = Filterize;

angular.module('filterize', [])

//Controllers
.controller('filterSelectionController', filterSelectionController)
.controller('toolBoxController', toolBoxController)
.controller('fileControlsController', fileControlsController)
.controller('fileUploaderController', fileUploaderController)

//Services
.service('filterService', filterService)

//Directives
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
.directive('fileControls', () => {
    return {
        restrict: 'E',
        templateUrl: 'tpls/fileControls.tpl.html',
        controller: 'fileControlsController'       
    }
})
.directive('fileUploader', () => {
    return {
        restrict: 'E',
        templateUrl: 'tpls/fileUploader.tpl.html',
        controller: 'fileUploaderController'       
    }
})

.run(function($window, $rootScope, filterService) {

    let img = document.getElementById('replaceMe');
    $rootScope.selectedFilter = filterService[0];
    let pre = (imgData, drawFn) => {

    }

    let post = (imgData, drawFn) => {
        var data = $rootScope.selectedFilter.fn(imgData.data);
        drawFn(new ImageData(data,imgData.width, imgData.height));
    }

    $rootScope.filterize = new Filterize(img, pre, post, 20);
    document.getElementById('putCanvasHere').appendChild($rootScope.filterize.getCanvas());
});

