let filterSelectionController = ($scope, filterService) => {

    $scope.filters = filterService;
    $scope.selectedFilter = filterService[0];
    $scope.selectedFilter.selected = true;
    $scope.select = (filter) => {
        $scope.selectedFilter.selected = false;
        filter.selected = true;
        $scope.selectedFilter = filter;
    }
}


export default filterSelectionController;
