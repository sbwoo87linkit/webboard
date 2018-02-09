app.controller('board.create.ctrl', function ($scope, $window, $rootScope, $stateParams, $http, boardService,  toastr, config) {

    // $rootScope.menu = menuService.get($stateParams).menu;
    // $scope.viewTitle = menuService.get($stateParams).boardTitle;

    $scope.apiUrl = config.apiUrl;


    $scope.data = {
        "articleType": $stateParams.sub_menu,
        "image": "article2.jpg",
        "title": "[" + $stateParams.title + "] Board 테스트 Title",
        "content": "첫번째줄 테스트 글내용 입니다.\n두번째줄 테스트 글내용 입니다.\n3번째줄 테스트 글내용 입니다.\n4번째줄 테스트 글내용 입니다.\n5번째줄 테스트 글내용 입니다.",
        "date": new Date(),
        "images": [],
        "files": []
    }

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
                $scope.isUploading = false;
                console.log(res.data);
                $scope.data.images.push({ url: "/files/" + res.data });
            }, function (err) {
                $scope.isUploading = false;
                console.log("error", err)
            });
        });
    };

    $scope.deleteFile = function (index) {
        $scope.data.files.splice(index, 1)
    }

    $scope.isUploading = false;

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
                console.log(res.data);
                $scope.data.files.push({ url: "/files/" + res.data });
                $scope.isUploading = false;
            }, function (err) {
                $scope.isUploading = false;
                console.log("error", err)
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

        boardService.post($scope.data).then(
            function () {
                window.history.back();
            },
            function (err) {
                alert(err);
                window.history.back();
            }
        )

    }
    $scope.goBack = function () {
        window.history.back();
    }

})

