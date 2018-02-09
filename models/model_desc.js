
//카페 리스트
var cafeinfos = [{
    cafe_id: "20161101cafe",//카페 키
    title: "피플스카페",
    tel:"02-2271-5080",
    address:"서울 중구 ",
    operation_week : "11:00~21:00",
    operation_holi : "11:00~22:00",
    plug_count: 24,
    seats : 50,
    latitude:37.5612206,
    longitude:126.993997,
    rating:4.5,

    //카페이미지
    image:[{
        key:1,
        path:"http://localhost:3010/public/images/bg1.jpg"
    },
        {
            key:2,
            path:"http://dev.cafego.kr/public/images/bg2.jpg"
        }
    ],

    //카페의 리뷰
    ofReviews:[{
        review_id:"20161101rev",
        user_id : "20161101user2",
        username:"박웅종",
        date:new Date(),
        title:"괜찮아요",
        content:"가격도 싸고 친절하네요 !",
        rating:5
    }],

    //카페의 쿠폰
    ofCoupons:{
        coupon_id:"20161101coup",
        title:"아메리카노 1+1",
        detail:"중복할인 불가, 사이즈업 500원 추가",
        expired:new Date()
    },

    //메뉴판
    ofMenu:[{
        name:"아메리카노",
        price:2500
    },
        {
            name:"얼그레이",
            price:2500
        }],

    //카페의 태그.
    ofTags:[
        {tag_id:"20161101tag1" ,tag :"로스터리"},
        {tag_id:"20161101tag2", tag: "테라스"}
    ],

    //카페의 편의시설여부 :wifi,plug, 24h ,parking, toilet, smoke
    ofFacilities:[true, true, false, false, true, true],

}];
//카페 끝

//카페갈래 관리자
var admin = {
    email : "admin@cafego.kr",
    password : "123123",
    name : "카페갈래",
};


var req_newcafe ={

  manager_email : manager.email,
  manager_name : manager.name,

  //신청할 카페.
//  cafeinfos : ...
};


//카페 업주
var manager={
    //카페 업주 정보
    manager_id : "20161101mng",//키
    email : "shpongle2634@gmail.com",
    password : "123123",
    name :"서태훈",
    tel : "01071377034",

//사업자 등록번호
    regist_num:"123-12-12345",


//관리하는 카페
// DB상에는 카페 키만을 저장한다. 키를 통해 조인한 결과로 아래와 같이 카페정보가 구성
//나머지 쿠폰, 리뷰, 태그
    ofcafe:{
        cafe_id: "20161101cafe",//카페 키
        title: "피플스카페",
        tel:"02-2271-5080",
        address:"서울 중구 ",
        operation_week : "11:00~21:00",
        operation_holi : "11:00~22:00",
        plug_count: 24,
        seats : 50,
        latitude:37.5612206,
        longitude:126.993997,
        rating:4.5,

        //카페이미지
        image:[{
            key:1,
            path:"http://manager.cafego.kr/public/images/bg1.jpg"
        },
            {
                key:2,
                path:"http://manager.cafego.kr/public/images/bg2.jpg"
            }
        ],

        //카페의 리뷰
        ofReviews:[{
            review_id:"20161101rev",
            user_id : "20161101user2",
            username:"박웅종",
            date:new Date(),
            title:"괜찮아요",
            content:"가격도 싸고 친절하네요 !",
            rating:5
        }],

        //카페의 쿠폰
        ofCoupons:{
            coupon_id:"20161101coup",
            title:"아메리카노 1+1",
            detail:"중복할인 불가, 사이즈업 500원 추가",
            expired:new Date()
        },

        //메뉴판
        ofMenu:[{
            menu_id:"20161101menu1",
            name:"아메리카노",
            price:2500
        },
            {
                menu_id:"20161101menu2",
                name:"얼그레이",
                price:2500
            }],

        //카페의 태그.
        ofTags:[
            {tag_id:"20161101tag1" ,tag :"로스터리"},
            {tag_id:"20161101tag2", tag: "테라스"}
        ],

        //카페의 편의시설여부 :wifi,plug, 24h ,parking, toilet, smoke
        ofFacilities:[true, true, false, false, true, true],

    }
};
//관리자 끝




//클라이언트 유저
var user ={
    user_id:"20161101user1",
    email:"shpongle2634@naver.com",
    password:"123123",
    title:"마포의 커피인",
    name:"서태훈",
    birth:new Date("1991.03.26"),
    gender:"m", //m or f


//내 찜한카페.
    ofFavorites :[{
        cafe_id: "20161101cafe",
        title: "피플스카페",
        tel:"02-2271-5080",
        address:"서울 중구 ",
        operation_week : "11:00~21:00",
        operation_holi : "11:00~22:00",
        plug_count: 24,
        seats : 50,

        latitude:37.5612206,
        longitude:126.993997,
        rating:4.5,

        //카페이미지
        image:[{
            key:1,
            path:"http://manager.cafego.kr/public/images/bg1.jpg"
        },
            {
                key:2,
                path:"http://manager.cafego.kr/public/images/bg2.jpg"
            }
        ],

        //카페의 리뷰
        ofReviews:[{
            review_id:"20161101rev",

            user_id :"20161101user2",
            username:"박웅종",
            date:new Date(),
            title:"괜찮아요",
            content:"가격도 싸고 친절하네요 !",
            rating:5
        }],

        //카페의 쿠폰
        ofCoupons:{
            coup_id:"20161101coup", //쿠폰 식별자
            title:"아메리카노 1+1",
            detail:"중복할인 불가, 사이즈업 500원 추가",
            expired:new Date()
        },

        //메뉴판
        ofMenu:[{
            menu_id:"20161101menu1",
            name:"아메리카노",
            price:2500
        },
            {
                menu_id:"20161101menu2",
                name:"얼그레이",
                price:2500
            }],

        //카페의 태그.
        ofTags:[
            {tag_id:"20161101tag1" ,tag :"로스터리"},
            {tag_id:"20161101tag2", tag: "테라스"}
        ],

        //카페의 편의시설여부 :wifi,plug, 24h ,parking, toilet, smoke
        ofFacilities:[true, true, false, false, true, true],

    }],
//찜한카페 끝


    //사용자가 남긴 리뷰
    ofReviews:[ {
        review_id:"20161101rev",
        cafe_id:"20161101cafe",

        username:"서태훈",
        date:new Date(),
        title:"나쁘지않네요",
        content:"가격 부담없고, 로스팅이 괜찮은 수준!",
        rating:4
    }],

    //사용자가 받은 쿠폰
    ofCoupons:[{
        cafe_id:"20161101cafe", //대상카페
        title:"아메리카노 1+1",
        detail:"중복할인 불가, 사이즈업 500원 추가",
        expired:new Date()
    }],

    //사용자 관심태그
    ofMyTags:[
        {tag_id:"20161101tag1" ,tag :"로스터리"},
    ],

    //사용자 관심지역
    ofMyLocations:[{
        loc_id:"20161101loc",
        location:"충무로역",
        latitude:37.561603,
        longitude:126.9914833,
    }]

};
//클라이언트 끝





var coupon={


};

var reviews={


};

var locations={


};

var tags={


};

var menu={


};

var modifyinfos={


};
