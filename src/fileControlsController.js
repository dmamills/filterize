let fileControlsController = ($scope, $rootScope, API_URL) => {

    let filterize = $rootScope.filterize;
    let jsonHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    $scope.onReset = () => {
        filterize.reset();
    }

    $scope.onUndo = () => {
        filterize.undo();
    }

    $scope.toGif = () => {
        let frames = $rootScope.frames;
        let data = frames.map((f) => {
            return f.toJson();
        });

        fetch(`${API_URL}/gif`, {
            method: 'post',
            headers: jsonHeaders,
            body: JSON.stringify({
                frames: data
            })
        }).then((res) => { return res.json(); })
        .then(data => {

        }, err => {

        });

    }

    $scope.onSave = () => {

        let data = filterize.getCanvas().toDataURL();
        let formData = new FormData();
        formData.append('data', data);

        fetch(`${API_URL}/save`, {
            method: 'post',
            headers: jsonHeaders,
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
