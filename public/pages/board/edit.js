
app.controller('board.edit.ctrl', function ($scope, $rootScope, $window, $http, $stateParams, boardService,  toastr, config) {


    // $rootScope.menu = menuService.get($stateParams).menu;
    // $scope.viewTitle = menuService.get($stateParams).boardTitle;

    $scope.apiUrl = config.apiUrl;

    $scope.goBack = function () {
        window.history.back();
    }

    // $scope.deleteFile = function (index) {
    //     $scope.data.files.splice(index, 1)
    // }
    // $scope.file_changed = function (element) {
    //
    //     $scope.$apply(function (scope) {
    //         var file = element.files[0];
    //         var reader = new FileReader();
    //         var fd = new FormData();
    //         fd.append('file', file);
    //         // $http.post($rootScope.baseUrl + '/api/photos/', fd, {   //  '/api/photos/'
    //         $http.post(config.apiUrl + '/api/files/', fd, {   //  '/api/photos/'
    //             transformRequest: angular.identity,
    //             headers: {'Content-Type': undefined}
    //         }).then(function (res) {
    //             $scope.data.files.push({url: "/files/" + res.data});
    //             // $scope.data.file = "/photos/" + res.data;
    //             // console.log(res);
    //         }, function (err) {
    //             console.log("error", err)
    //         });
    //     });
    // };

    $scope.deleteImage = function (index) {
        $scope.data.images.splice(index, 1)
    }
    $scope.imageChanged = function (element) {

        $scope.isUploading = true;
        $scope.$apply(function (scope) {
            var file = element.files[0];
            var fd = new FormData();
            fd.append('file', file);
            $http.post(config.apiUrl + '/api/files/', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function (res) {
                $scope.data.images.push({ url: "/files/" + res.data });
                $scope.isUploading = false;
            }, function (err) {
                console.log("error", err)
                $scope.isUploading = false;
            });
        });
    };

    $scope.deleteFile = function (index) {
        $scope.data.files.splice(index, 1)
    }
    $scope.fileChanged = function (element) {

        $scope.isUploading = true;
        $scope.$apply(function (scope) {
            var file = element.files[0];
            var fd = new FormData();
            fd.append('file', file);
            $http.post(config.apiUrl + '/api/files/', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function (res) {
                $scope.data.files.push({ url: "/files/" + res.data });
                $scope.isUploading = false;
            }, function (err) {
                console.log("error", err)
                $scope.isUploading = false;
            });
        });
    };

    $scope.save = function () {

        if (!$scope.data.title) {
            toastr.error("제목을 추가해 주세요");
            return;
        }
        // if (!$scope.data.content) {
        //     toastr.error("내용을 추가해 주세요");
        //     return;
        // }

        // if ($stateParams.articleType === 'notice' || $stateParams.articleType === 'news') {
        //     if ($scope.data.images.length === 0) {
        //         toastr.error("이미지 파일을 추가해 주세요");
        //         return;
        //     }
        // }

        // 서버에서 req.body를 저장하기 위해서, _id를 삭제하고 전송한다.
        delete $scope.data._id;

        boardService.update($stateParams.articleId, $scope.data).then(
            function () {
                window.history.back();
            },
            function (err) {
                alert(JSON.stringify(err));
                window.history.back();
            }
        )

    }


    boardService.get($stateParams.articleId).then(
        function (result) {
            console.log(result);
            $scope.data = result.data;
        }, function (err) {
            alert(err);
        }
    )

})

