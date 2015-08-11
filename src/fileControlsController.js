let fileControlsController = ($scope) => {
    $scope.onReset = $scope.onReset || angular.noop;
    $scope.onUndo = $scope.onUndo || angular.noop;
    $scope.onSave = $scope.onSave || angular.noop;

    console.log('fcc');
}


export default fileControlsController;
