let fileControlsController = ($scope, $rootScope, API_URL) => {

    let filterize = $rootScope.filterize;

    $scope.onReset = () => {
        filterize.reset();
    }

    $scope.onUndo = () => {
        filterize.undo();
    }

    $scope.onSave = () => {

        let data = filterize.getCanvas().toDataURL();
        let formData = new FormData();
        formData.append('data', data);

        fetch(`${API_URL}/save`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: data
            })
          }).then((res) => { return res.json(); })
          .then((data) => {
            var tempEl = document.createElement('a');
            tempEl.href = `${API_URL}/download/${data.id}`;
            tempEl.click();
          }, (err) => {

          });
    }
}


export default fileControlsController;
