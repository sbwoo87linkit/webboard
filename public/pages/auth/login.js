app.controller('login.ctrl', function ($scope, $window, $rootScope, $state, $stateParams, userService, toastr) {

    $scope.data = {
        // email:"sdsn_korea@korea.ac.kr",
        email: "mlrn_korea@korea.ac.kr",
        password: "admin1234"
    }

    $scope.login = function () {

        if (!$scope.data.email) {
            toastr.error("이메일을 입력해 주세요");
            return;
        }
        if (!$scope.data.password) {
            toastr.error("암호를 입력해 주세요");
            return;
        }

        userService.login($scope.data).then(
            function (result) {
                var token = result.data.id_token;
                var payload = JSON.parse(atob(token.split('.')[1]));
                $rootScope.user = payload;
                $window.localStorage.setItem('token', JSON.stringify(payload));


                //console.log(playload);
                // window.history.back();
                $state.go('home')

            },
            function (err) {
                console.log('Login error', err)
                toastr.error('Login error. Please try again.');
                // alert(JSON.stringify(err));
                // window.history.back();
                $state.go('login')
            }
        )

    }

    $scope.logout = function () {
        $window.localStorage.removeItem('token');
        $rootScope.user = null;
        // console.log("rootScope.user : " + $rootScope.user);
        toastr.success("You have logged out.");
        $state.go('login');
    }

    // $scope.signup = function () {

    //     if (!$scope.data.email) {
    //         toastr.error("이메일을 입력해 주세요");
    //         return;
    //     }
    //     if (!$scope.data.password) {
    //         toastr.error("암호를 입력해 주세요");
    //         return;
    //     }

    //     userService.signup($scope.data).then(
    //         function () {
    //             window.history.back();
    //         },
    //         function (err) {
    //             alert(JSON.stringify(err));
    //             window.history.back();
    //         }
    //     )

    // }


    // boardService.get($stateParams.articleId).then(
    //     function (result) {
    //         console.log(result);
    //         $scope.item = result.data[0];
    //     }, function (err) {
    //         alert(err);
    //     }
    // )

})

