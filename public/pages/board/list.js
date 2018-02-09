
app.controller('board.list.ctrl', function ($scope, $rootScope, $window, $stateParams, boardService, toastr, $log,  config, $ngConfirm) {

    console.log('aaaa');

    $scope.apiUrl = config.apiUrl;
    // $scope.boardType = menuService.get($stateParams).boardType;
    // $rootScope.menu = menuService.get($stateParams).menu;
    // $scope.viewTitle = menuService.get($stateParams).boardTitle;

    $scope.data = { "searchText": "" };

    $scope.pagination = {
        maxSize: 5,
        totalItems: 0,
        currentPage: 1,
        itemsPerPage: 2,

    };

    $scope.load = function (page) {

        console.log('page', page);
        // $scope.currentPage = page;
        boardService.load($stateParams.sub_menu, page, $scope.pagination.itemsPerPage, $scope.data.searchText).then(
            function (res) {
                // console.log('res', res);
                $scope.items = res.data.list;
                // $scope.items = res.data;
                // console.log('res....', res)
                $scope.pagination.totalItems = res.data.count;
            },
            function (err) {
                console.log(err);
            }
        );
    }

    // initial load & reset
    $scope.load($scope.currentPage);

    $scope.pageChanged = function () {
        console.log('Page changed to: ' + $scope.pagination.currentPage);
        // $scope.load($scope.pagination.currentPage);
    };

    $scope.search = function () {
        $scope.pagination.currentPage = 1;
        $scope.load($scope.pagination.currentPage);
    }

    $scope.reset = function () {
        $scope.pagination.currentPage = 1;
        $scope.data.searchText = "";
        $scope.load($scope.pagination.currentPage);
    }

    // $scope.delete = function () {
    //     // alert('delete')
    //     // console.log($scope.data.selectedItem)

    //     boardService.delete($scope.data.selectedItem._id).then(
    //         function (result) {
    //             // window.history.back();
    //             $scope.load($scope.currentPage);
    //         }, function (err) {
    //             alert(err);
    //         }
    //     )
    // }

    $scope.delete = function (item) {

                        console.log(item)

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


                        boardService.delete(item._id).then(
                            function (result) {
                                window.history.back();
                            }, function (err) {
                                console.log(err);
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

})
