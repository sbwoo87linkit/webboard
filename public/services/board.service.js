app.factory('boardService', function ($http, config) {

    var factory = {};

    factory.notices = []

    factory.load = function (articleType, page, pageSize, searchText) {
        // console.log("articleType :::: " + articleType)
        return $http.get(config.apiUrl + '/board?page=' + page + '&rows=' + pageSize + '&articleType=' + articleType + '&searchText=' + searchText);
    }

    factory.get = function (sid) {
        return $http.get(config.apiUrl + '/board/' + sid);
    }


    factory.post = function (item) {
        return $http.post(config.apiUrl + '/board', item);
    }

    factory.update = function (sid, item) {
        return $http.put(config.apiUrl + '/board/' + sid, item);
    }


    factory.delete = function (sid) {
        return $http.delete(config.apiUrl + '/board/' + sid);
    }


    return factory;

});
