
app.controller('board.list.ctrl', function ($scope, $rootScope, $window, $stateParams, boardService, appContextService, toastr, $log,  $ngConfirm) {

    var vm = this;
    vm.appContext = appContextService.context;
    // console.log('board.list.ctrl ... $stateParams.menu', $stateParams.menu)


    // vm.apiUrl = config.apiUrl;
    // vm.boardType = menuService.get($stateParams).boardType;
    // $rootScope.menu = menuService.get($stateParams).menu;
    // vm.viewTitle = menuService.get($stateParams).boardTitle;


    // return;


    vm.data = { "searchText": "" };

    vm.pagination = {
        maxSize: 5,
        totalItems: 0,
        currentPage: 1,
        itemsPerPage: 10,

    };

    vm.load = function (page) {

        console.log('page', page);
        // vm.currentPage = page;
        boardService.load($stateParams.sub_menu, page, vm.pagination.itemsPerPage, vm.data.searchText).then(
            function (res) {
                // console.log('res', res);
                vm.items = res.data.list;
                // vm.items = res.data;
                // console.log('res....', res)
                vm.pagination.totalItems = res.data.count;
            },
            function (err) {
                console.log(err);
            }
        );
    }

    // initial load & reset
    vm.load(vm.currentPage);

    vm.pageChanged = function () {
        console.log('Page changed to: ' + vm.pagination.currentPage);
        // vm.load(vm.pagination.currentPage);
    };

    vm.search = function () {
        vm.pagination.currentPage = 1;
        vm.load(vm.pagination.currentPage);
    }

    vm.reset = function () {
        vm.pagination.currentPage = 1;
        vm.data.searchText = "";
        vm.load(vm.pagination.currentPage);
    }

    // vm.delete = function () {
    //     // alert('delete')
    //     // console.log(vm.data.selectedItem)

    //     boardService.delete(vm.data.selectedItem._id).then(
    //         function (result) {
    //             // window.history.back();
    //             vm.load(vm.currentPage);
    //         }, function (err) {
    //             alert(err);
    //         }
    //     )
    // }

    vm.delete = function (item) {

                        console.log(item)

                        $ngConfirm({
            boxWidth: '30%',
            useBootstrap: false,
            title: '삭제확인',
            content: '삭제하시겠습니까?',
            scope: vm,
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
