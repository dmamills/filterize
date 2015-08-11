var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function (factory) {
    !(typeof exports === 'object' && typeof module !== 'undefined') && typeof define === 'function' && define.amd ? define(factory) : factory();
})(function () {
    'use strict';

    var Pixel__Pixel = (function () {
        function Pixel__Pixel(r, g, b, a) {
            _classCallCheck(this, Pixel__Pixel);

            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        _createClass(Pixel__Pixel, [{
            key: 'toData',
            value: function toData() {
                return [this.r, this.g, this.b, this.a];
            }
        }, {
            key: 'toHex',
            value: function toHex() {
                var n = (this.r << 16) + (this.g << 8) + this.b;
                return n.toString(16);
            }
        }]);

        return Pixel__Pixel;
    })();

    var Pixel__default = Pixel__Pixel;

    var Conversions__Conversions = {
        toRGB: function toRGB(imgData) {
            var rgb = [];
            var data = imgData.data;
            for (var i = 0; i < data.length; i += 4) {
                var pixel = new Pixel(data[i], data[i + 1], data[i + 2], data[i + 3]);
                rgb.push(pixel);
            }
            return rgb;
        },
        toImgData: function toImgData(rgb, w, h) {}
    };

    var Conversions__default = Conversions__Conversions;

    var filterize = (function () {
        function filterize(imgEl, preFilterFn, postFilterFn, brushSize) {
            _classCallCheck(this, filterize);

            this.imgEl = imgEl;
            this.preFilter = preFilterFn;
            this.postFilter = postFilterFn;
            this.brushSize = brushSize;
            this.mouseDown = false;
            this.undoHistory = [];

            this.canvas = document.createElement('canvas');
            this.canvas.style.cursor = 'pointer';
            this.ctx = this.canvas.getContext('2d');

            this.imgEl.onload = (function () {
                var w = this.imgEl.width;
                var h = this.imgEl.height;
                this.canvas.width = w;
                this.canvas.height = h;

                this.ctx.drawImage(this.imgEl, 0, 0, w, h);
                var imgData = this.ctx.getImageData(0, 0, w, h);

                this.preFilter(imgData);

                this.canvas.onmousedown = (function (e) {
                    this.mouseDown = true;
                    this.undoHistory.push(this.takeSnapshot());
                    this.applyFilter(e);
                }).bind(this);

                this.canvas.onmouseup = (function (e) {
                    this.mouseDown = false;
                }).bind(this);

                this.canvas.onmousemove = (function (e) {
                    if (!this.mouseDown) return;

                    this.applyFilter(e);
                }).bind(this);
            }).bind(this);
        }

        _createClass(filterize, [{
            key: 'applyFilter',
            value: function applyFilter(e) {
                var x = e.offsetX;
                var y = e.offsetY;
                var h = this.brushSize / 2;

                var sx = e.offsetX - h >= 0 ? e.offsetX - h : 0;
                var sy = e.offsetY - h >= 0 ? e.offsetY - h : 0;

                var tempData = this.ctx.getImageData(sx, sy, this.brushSize, this.brushSize);

                var drawFn = this.createDrawFn(e);
                this.postFilter(tempData, drawFn);
            }
        }, {
            key: 'takeSnapshot',
            value: function takeSnapshot() {
                var w = this.imgEl.width;
                var h = this.imgEl.height;
                return this.ctx.getImageData(0, 0, w, h);
            }
        }, {
            key: 'undo',
            value: function undo() {
                if (this.undoHistory.length === 0) {
                    alert('nothing to undo');
                    return;
                }

                var lastSnapshot = this.undoHistory.pop();
                this.ctx.putImageData(lastSnapshot, 0, 0);
            }
        }, {
            key: 'createDrawFn',
            value: function createDrawFn(e) {
                return (function (imgData) {
                    var h = this.brushSize / 2;
                    var sx = e.offsetX - h >= 0 ? e.offsetX - h : 0;
                    var sy = e.offsetY - h >= 0 ? e.offsetY - h : 0;
                    this.ctx.putImageData(imgData, sx, sy);
                }).bind(this);
            }
        }, {
            key: 'setPostFilter',
            value: function setPostFilter(fn) {
                this.postFilter = fn;
            }
        }, {
            key: 'setBrushSize',
            value: function setBrushSize(size) {
                this.brushSize = size;
            }
        }, {
            key: 'loopFrames',
            value: function loopFrames(frames, time) {
                this.lastSnapshot = this.takeSnapshot();
                var f = 0;
                this.loopInterval = setInterval((function () {
                    this.ctx.putImageData(frames[f++], 0, 0);
                    if (f > frames.length - 1) f = 0;
                }).bind(this), time);
            }
        }, {
            key: 'stopLoop',
            value: function stopLoop() {
                clearInterval(this.loopInterval);
                this.ctx.putImageData(this.lastSnapshot, 0, 0);
            }
        }, {
            key: 'getCanvas',
            value: function getCanvas() {
                return this.canvas;
            }
        }, {
            key: 'reset',
            value: function reset() {
                var w = this.imgEl.width;
                var h = this.imgEl.height;
                this.undoHistory = [];
                this.ctx.drawImage(this.imgEl, 0, 0, w, h);
            }
        }]);

        return filterize;
    })();

    ;

    filterize.Conversions = Conversions__default;
    filterize.Pixel = Pixel__default;

    var Filter = function Filter(name, fn) {
        _classCallCheck(this, Filter);

        this.name = name;
        this.fn = fn;
    };

    ;

    var toolBoxController__toolBoxController = function toolBoxController__toolBoxController($scope) {

        $scope.selectedFilter = undefined;
        $scope.brushSize = 20;
    };

    var toolBoxController__default = toolBoxController__toolBoxController;

    var filterSelectionController__filterSelectionController = function filterSelectionController__filterSelectionController($scope, filterService) {

        $scope.filters = filterService;
        $scope.selectedFilter = filterService[0];
        $scope.selectedFilter.selected = true;
        $scope.select = function (filter) {
            $scope.selectedFilter.selected = false;
            filter.selected = true;
            $scope.selectedFilter = filter;
        };
    };

    var filterSelectionController__default = filterSelectionController__filterSelectionController;

    var _filterService__filterService = function _filterService__filterService() {

        var grayscaleFilter = new Filter('grayscale', function (data) {
            for (var i = 0; i < data.length; i += 4) {
                var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg;
                data[i + 1] = avg;
                data[i + 2] = avg;
            }

            return data;
        });

        var createAlterFilter = function createAlterFilter(threshold) {
            return function (data) {
                for (var i = 0; i < data.length; i += 4) {
                    data[i] = data[i] + data[i] * threshold;
                    data[i + 1] = data[i + 1] + data[i + 1] * threshold;
                    data[i + 2] = data[i + 2] + data[i + 2] * threshold;

                    if (data[i] > 255) data[i] = 255;
                    if (data[i + 1] > 255) data[i + 1] = 255;
                    if (data[i + 2] > 255) data[i + 2] = 255;
                }
                return data;
            };
        };

        var createColorFilter = function createColorFilter(n) {
            return function (data) {
                for (var i = 0; i < data.length; i += 4) {
                    data[i + n] = data[i + n] << 2 <= 255 ? data[i + n] << 2 : 255;
                }
                return data;
            };
        };

        var redFilter = new Filter('red', createColorFilter(0));
        var greenFilter = new Filter('green', createColorFilter(1));
        var blueFilter = new Filter('blue', createColorFilter(2));

        var brightenFilter = new Filter('brighten', createAlterFilter(0.1));
        var darkenFilter = new Filter('darken', createAlterFilter(-0.05));

        return [grayscaleFilter, redFilter, greenFilter, blueFilter, brightenFilter, darkenFilter];
    };

    var _filterService = _filterService__filterService;

    window.filterize = filterize;

    angular.module('filterize', []).controller('filterSelectionController', filterSelectionController__default).controller('toolBoxController', toolBoxController__default).service('filterService', _filterService).directive('toolBox', function () {
        return {
            restrict: 'E',
            templateUrl: 'tpls/toolBox.tpl.html',
            controller: 'toolBoxController'
        };
    }).directive('filterSelection', function () {
        return {
            restrict: 'E',
            templateUrl: 'tpls/filterSelection.tpl.html',
            controller: 'filterSelectionController'
        };
    }).run(function ($window, $rootScope, filterService) {});
});
//# sourceMappingURL=filterize.js.map