app.factory('userService', function($http, config){

  var factory = {};

  factory.signup = function(user) {
    console.log(user);
    return $http.post(config.apiUrl + '/user/signup', user);
  }

  factory.login = function(user) {
    return $http.post(config.apiUrl + '/user/login', user);
  }

  factory.list = function() {
    return $http.get(config.apiUrl + '/user/list');
  }




  return factory;

});
