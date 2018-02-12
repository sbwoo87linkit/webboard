
app.controller('board.view.ctrl', function ($scope, $rootScope, $window, $stateParams, boardService, toastr, $location, $ngConfirm, config, appContextService) {

    var vm = this;
    vm.appContext = appContextService.context;
    // if ($stateParams.articleType === 'un-sdsn') $scope.viewTitle = "UN SDSN 소식";
    // if ($stateParams.articleType === 'korea-sdsn') $scope.viewTitle = "Korea SDSN 소개";

    // $rootScope.menu = $window.localStorage.getItem('menu');
    // $scope.viewTitle = $window.localStorage.getItem('boardTitle');
    $scope.apiUrl = config.apiUrl;

    // $rootScope.menu = menuService.get($stateParams).menu;
    // $scope.viewTitle = menuService.get($stateParams).boardTitle;

    // console.log($rootScope.menu);
    // console.log($stateParams.articleType);

    $scope.delete = function () {

        $ngConfirm({
            boxWidth: '30%',
            useBootstrap: false,
            title: '삭제확인',
            content: '삭제하시겠습니까?',
            scope: $scope,
            buttons: {
                confirm: {
                    text: '삭제',
                    btnClass: 'btn-blue',
                    action: function (scope, button) {

                        boardService.delete($stateParams.articleId).then(
                            function (result) {
                                window.history.back();
                            }, function (err) {
                                alert(err);
                            }
                        )

                    }
                },
                cancel: {
                    text: '취소',
                    btnClass: 'btn-orange',
                    // action: function (scope, button) {
                    // }
                },
            }
        });

    }

    boardService.get($stateParams.articleId).then(
        function (result) {
            // console.log(result);
            $scope.item = result.data;
        }, function (err) {
            console.log(err);
        }
    )

    // console.log($location.$$url);
    $scope.id = $location.$$url;

})
