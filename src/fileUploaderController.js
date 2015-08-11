let fileUploaderController = ($scope) => {

    $scope.onUpload = $scope.onUpload || function(data) {
        debugger;

    };
    let uploadForm = document.getElementById('uploadForm');

    $scope.submit = (e) => {
        e.preventDefault();
        fetch('/upload', {
            method: 'post',
            body: new FormData(uploadForm)
        }).then(function(res) {
            return res.json();
        }).then($scope.onUpload, function(err) {
            console.log('error');
        });
    }
}

export default fileUploaderController;
