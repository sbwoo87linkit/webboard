app.controller('board.ctrl', function ($scope, $stateParams, boardService, toastr) {

    $scope.goBack = function () {
        window.history.back();
    }

    $scope.viewTitle = "";
    // console.log("board.ctrl ", $stateParams)

})