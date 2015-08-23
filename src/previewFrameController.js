let previewFrameController = ($scope) => {

    let c = document.createElement('canvas');
    let c2 = document.createElement('canvas');
    c.width = $scope.frame.data.width;
    c.height = $scope.frame.data.height;


    let ctx = c.getContext('2d');
    ctx.putImageData($scope.frame.data, 0, 0);
    ctx.drawImage(ctx.canvas, 0, 0, 0.3 * c.width, 0.3 * c.height);

    $scope.preview = c.toDataURL();
}

export default previewFrameController;
