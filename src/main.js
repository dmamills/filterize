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

//environment variables
.constant('API_URL', 'http://localhost:8000')
// .constant('API_URL', 'http://theglitchery.com');

.run(function($window, $rootScope, filterService) {

    let img = document.getElementById('replaceMe');
    $rootScope.selectedFilter = filterService[0];
    let pre = (imgData, drawFn) => {

    }

    $rootScope.onUpload = (filepath) => {
        //TODO: fix this don't create a new filterize object, just replace the base img
        // and reset everything inside the object. Filterize should be a singleton
        img.src = '/' + filepath;
        $rootScope.filterize = new Filterize(img, pre, post, 20);
        var canvasHolder = document.getElementById('putCanvasHere');
        canvasHolder.innerHTML = '';
        canvasHolder.appendChild($rootScope.filterize.getCanvas());
    }

    let post = (imgData, drawFn) => {
        var data = $rootScope.selectedFilter.fn(imgData.data);
        drawFn(new ImageData(data,imgData.width, imgData.height));
    }

    $rootScope.filterize = new Filterize(img, pre, post, 20);
    document.getElementById('putCanvasHere').appendChild($rootScope.filterize.getCanvas());
});

