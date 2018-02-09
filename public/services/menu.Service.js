
app.factory('menuService', function () {

    var factory = {};


    factory.get = function (state) {

        if (state.articleType === 'notice') {
            return { menu: 'news', boardTitle: '공지사항', boardType: "board" };
        }
        if (state.articleType === 'news') {
            return { menu: 'news', boardTitle: 'NEWS', boardType: "board" };
        }
        if (state.articleType === 'un-sdsn') {
            return { menu: 'news', boardTitle: 'UN SDSN 소식', boardType: "board" };
        }
        if (state.articleType === 'korea-sdsn') {
            return { menu: 'news', boardTitle: 'SDSN Korea 소식', boardType: "board" };
        }

        if (state.articleType === 'issue') {
            return { menu: 'resources', boardTitle: '연구 발간물', boardType: "gallary" };
        }
        if (state.articleType === 'event-docs') {
            return { menu: 'resources', boardTitle: '행사 자료집', boardType: "gallary" };
        }
        if (state.articleType === 'public') {
            return { menu: 'resources', boardTitle: '성명서', boardType: "public" };
        }


    }

    return factory;

});
