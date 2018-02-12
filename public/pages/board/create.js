app.controller('board.create.ctrl', function ($scope, $window, $rootScope, $stateParams, $http, boardService, toastr, config, appContextService) {

    var vm = this;
    vm.appContext = appContextService.context;

    var main_menu = vm.appContext.menuArray.find(function(menu){
        return menu.name === $stateParams.main_menu;
    }); 

    if ( main_menu) {
        vm.sub_menu = main_menu.list.find(function (menu) {
            return menu.name === $stateParams.sub_menu;
        }); 
    } 

    $scope.data = {
        "articleType": $stateParams.sub_menu,
        // "image": "article2.jpg",
        "title": "Board 테스트 Title",
        "content": `<h1 style="color: rgb(0, 0, 0);"><font color="#5c5c5c">H1 Title font</font></h1><p>l<img src="http://ojeri.korea.ac.kr/wp-content/themes/ojeri_new/img/logo.png" style="width: 273px;"></p><p><a href="http://ojeri.korea.ac.kr/wp-content/themes/ojeri_new/img/logo.png" target="_blank">Image link</a>&nbsp;&nbsp;<a href="http://google.com">http://google.com</a><font face="Segoe UI, Arial, sans-serif"><span style="font-size: 36px;">&nbsp;</span></font></p><p><span style="color: rgb(92, 92, 92);">The project will now focus on supporting the development of long-term low-emission development strategies, as agreed in the Paris Agreement. Energy research institutions from other countries are welcome to join the project. For more information please go to the</span><a href="http://www.deepdecarbonization.org/" target="_blank" style="background-color: rgb(255, 255, 255); box-sizing: border-box; color: rgb(51, 122, 183);">project’s website</a><span style="color: rgb(92, 92, 92);">.</span></p>`,
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

        // if (!$scope.data.title) {
        //     toastr.error("제목을 추가해 주세요");
        //     return;
        // }


        if (vm.sub_menu.mustHaveImage && $scope.data.images.length === 0) {
                toastr.error("이미지 파일을 추가해 주세요");
                return;
        }

        // return;


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

