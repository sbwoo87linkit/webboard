app.controller('main.ctrl', function ($scope, userService, toastr) {

    userService.list().then(function(res){
        // console.log(res);
        $scope.users = res.data;
        if (!res.data.length) {
            toastr.info('ctrl. No admin users are registered.')
        }
    });

    $scope.styleName = 'green.theme.css';

    $scope.changeStyle = function (styleName) {
        $scope.styleName = styleName + '.css';
    };

})


