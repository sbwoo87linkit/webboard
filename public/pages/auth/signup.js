app.controller('signup.ctrl', function($scope, $rootScope, $state, $stateParams, $http, toastr, config){

    // $scope.user ={
    //     email : "shpongle2634@gmail.com",
    //     password : "123123",
    //     name :"서태훈",
    //     tel : "01071377034",
    //     role: "manager",
    //     regist_num:"123-12-12345",
    //     created: new Date(),     //등록일
    //     last_login: new Date(),  //마지막 로그인 일시
    // };

    $scope.data = {
        // email: 'sdsn_korea@korea.ac.kr',
        email: 'mlrn_korea@korea.ac.kr',
        password: 'admin1234',
        role: 'admin'
    }

    $scope.data.roleChange = function(data) {
        console.log('role', data);
        data.role === 'admin' ? data.email = 'mlrn_korea@korea.ac.kr' : data.email = 'mlrn_korea_manager@korea.ac.kr' 
    }   

    $scope.signup = function (user) {

        // admin 계정 :  sdsn_korea@korea.ac.kr 암호: admin1234
        console.log('user', user);

        // return;

         $http.post(config.apiUrl + '/user/signup', user).then(function (res) {

            $state.go('signin')

        }, function (err) {
            console.log(err)
            var msg = 'Signup error.'
            if (err.status == 409) {
                msg = msg + ' Duplication. Email already exist.'
            }
            toastr.error(msg)
        })
    }


})
