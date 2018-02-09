var config = require('../config');
var mongoClient = require('mongodb').MongoClient;
var bcrypt = require("bcrypt-nodejs");
var jwt     = require('jsonwebtoken');
var co = require('co');
var model = require('../../models/model');

var db;
var collection;

mongoClient.connect(config.connectionString, function (err, database) {
    if (err)
        console.log(err);
    else {
        db = database;
    }
});

//카페 검색 및 리스트
exports.list = function(req,res){
  co(function*(){

    if(req.query.keyword){ //검색 리스트.
      var keyword =  req.query.keyword.split(' ');
      var location;
        var args = new Array();
        for(var key in keyword){
          //var loc = yield model.findDoc({name :{$regex :keyword[key]}},db.collection('locations')); //지역검색인 경우, 따로 처리.

              args.push({ name :{$regex :keyword[key]}});
              args.push( { 'menu.name' :{$regex :keyword[key]}});
              args.push( { tags : {$regex :keyword[key]}});

        }
        console.log(args);
        var result =yield model.list(Number(req.query.page), Number(req.query.rows),{$or:args}, db.collection('cafeinfos'));
        res.status(200).send(result);
    }
    else { // 메인 리스트 : 현재위치 기반
      var lng = req.query.lng;
      var lat = req.query.lat;
      if(lng && lat){
      var scope= { $nearSphere: {
                    $geometry: {
                      type: 'Point',
                      coordinates: [lng, lat]
                    },
                    $maxDistance: 5000, //5km
                  }
              };
        var result =yield model.list(Number(req.query.page), Number(req.query.rows),scope, db.collection('cafeinfos'));
        res.status(200).send(result);
    } else{
      var result =yield model.list(Number(req.query.page), Number(req.query.rows),{}, db.collection('cafeinfos'));
      res.status(200).send(result);
    }
  }
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).send(err);
  });
};

//정보 수정 요청
exports.modify_request_new =function(req,res){
  co(function*(){
    var result = yield model.insertDoc(req.body, db.collection('modify_requests'),'modify_requests_id');
    if(result.n === 1)
      res.status(200).send(result);
    else res.status(400).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(400).end();
  });
};



//jwt
//카페 상세보기 : 이름,주소, 전화번호, 영업시간, 메뉴,
exports.view = function(req,res){
  co(function*(){
    var args = { sid : Number(req.params.sid)};
    var result =yield model.findDoc(args, db.collection('cafeinfos'));
    if(result)
      res.status(200).send(result);
    else res.status(404).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).send(err);
  });
};

//마이페이지 : 이메일, 이름, 타이틀, 찜한카페, 내쿠폰, 내리뷰
  exports.mypage = function(req,res){
    co(function*(){
      var args = { sid : Number(req.params.sid)};
      var result = yield model.findDoc(args, db.collection('users'));
        if( result ){
      //리뷰, 찜한카페, 쿠폰 로드
      var review_args =  {  user_sid: result[0].sid , user_name:  result[0].name};
      var favorite_args ={ favorite_by : Number(result[0].sid) };
      var coupon_args = { get  : { user_sid : result[0].sid , used : false} };

      var reviews = yield model.findDoc(review_args , db.collection('reviews'));
      var favorites = yield model.findDoc(favorite_args, db.collection('cafeinfos'));
      var coupons =yield model.findDoc(coupon_args,db.collection('coupons'));

      result[0].ofReviews =reviews? reviews:null;
      result[0].ofFavorites =favorites?favorites:null;
      result[0].ofCoupons = coupons?coupons:null;

     res.status(200).send(result);
   }else res.status(400).send(result);
    }).catch(function(err){
      console.log(err);
      console.log(err.stack);
      res.status(500).send(err);
    });
  };

  //jwt
  //리뷰 작성
  exports.create_review =function(req,res){
      co(function*(){
        req.body.cafe_sid = Number(req.params.sid);
        req.body.user_sid = Number(req.body.user_sid);
        var result = yield model.insertDoc(req.body, db.collection('reviews'));
        if(result.n ===1){
          var wherecafe ={ sid : Number(req.params.sid)};
          var whereuser = {sid : Number(req.body.user_sid)};
          var modify= { $inc : {total_reviews:1}  };
          var cafe= yield model.findDoc(wherecafe,db.collection('cafeinfos'));
          if(cafe){
          cafe[0].total_reviews = (cafe[0].total_reviews)?cafe[0].total_reviews+1 : 1;
          // if(cafe[0].ofReviews) cafe[0].ofReviews.push(result.sid);
          // else cafe[0].ofReviews=[result.sid];
          cafe[0].total_stars =cafe[0].total_stars ? ((cafe[0].total_stars*(cafe[0].total_reviews-1))+Number(req.body.rating))/cafe[0].total_reviews :Number(req.body.rating);
        var cafeupdate = yield model.updateDoc(wherecafe, cafe[0],db.collection('cafeinfos'));
        var userupdate = yield model.partialUpdate(whereuser,modify,db.collection('users'));
        if(cafeupdate.nModified ===1 && userupdate.nModified ===1)
          res.status(200).send(result);
        else
         res.stauts(500).send();
       }
      }else res.status(400).send(result);
      }).catch(function(err){
        console.log(err);
        console.log(err.stack);
        res.status(500).send(err);
    });
  };


//카페 리뷰 리스트
exports.cafe_reviews = function(req,res){
  co(function*(){
    var args = { cafe_sid : Number(req.params.sid)};
      var ofReviews = yield model.list( Number(req.query.page), Number(req.query.rows), args, db.collection('reviews'));
      if(ofReviews)
          res.status(200).send(ofReviews);
      else res.status(400).send();
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).send(err);
  });
};

//카페 찜하기 / 해제하기
exports.change_favorite =function(req,res){
  co(function*(){
    var uid = Number(req.params.uid);
    var cid = Number(req.params.cid);
    var result,where,modify,modify2;

    where = { sid : cid};
    modify ={ $addToSet : {favorite_by :uid } };
    var verify = yield model.partialUpdate(where, modify,db.collection('cafeinfos'));

    if(verify.nModified ===1){ //찜한카페 등록
      modify2 = { $inc : { total_favorites:1 } };
    }else{ //찜한카페 해제
      modify2 = { $inc : { "total_favorites":-1 }, $pull :{ "favorite_by" : uid} };
    }
    result =yield model.partialUpdate(where, modify2, db.collection('cafeinfos'));
    if(result.nModified===1){
      res.status(200).send(result);
    }
    else res.status(400).send();
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).send(err);
  });
};


//쿠폰발급
exports.get_coupon =function(req,res){
  co(function*(){
    var check1 = { $and : [ {sid : Number(req.params.cid)}, {get :{user_sid : Number(req.params.uid), used:false} }]};
    var check2 = { $and : [ {sid : Number(req.params.cid)}, {get :{user_sid : Number(req.params.uid)},used:true }]};
    var verify1 = yield model.findDoc(check1, db.collection('coupons'));
    var verify2= yield model.findDoc(check2,db.collection('coupons'));
    if(verify1){
      res.status(500).send('Already Issued.');
    }else if(verify2){
      res.status(500).send('Already Used.');
    }
    else{
      var where = { sid : Number(req.params.cid)};
      var modify= { $addToSet: { get :{user_sid : Number(req.params.uid),  used: false }}, $inc :{EA : -1 }};
      var result = yield model.partialUpdate(where,modify, db.collection('coupons'));
      if(result.nModified ===1){
        res.status(200).send(result);
      }
    }
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).send(err);
  });

};

//쿠폰사용
exports.use_coupon = function(req,res){
  co(function*(){
    var check1 = { $and : [ {sid : Number(req.params.cid)}, {get :{user_sid : Number(req.params.uid), used:false} }]};
    var modify ={ $set:{"get.$.used": true}};
    var verify1 = yield model.partialUpdate(check1,modify ,db.collection('coupons'));
    if(verify1.nModified ===1){
      res.status(200).send(verify1);
    }
    else{
      var check2 = { $and : [ {sid : Number(req.params.cid)}, {get :{user_sid : Number(req.params.uid),used:true} }]};
      var verify2= yield model.findDoc(check2,db.collection('coupons'));
      if(verify2){
        res.status(500).send('Already Used');
      }
      else{
        res.status(500).send('Can Not Found Coupons');
      }
    }


  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).send(err);
  });
};

//타이틀 조회
exports.load_title = function(req,res){
co(function*(){
    var args = { user_sid : Number(req.params.sid)};
    var result = yield model.findDoc(args, db.collection('titles'));
    if(result){
      for(var t in result){
      delete t.user_sid;
      delete t.ofUserCount;
      delete t.sid;
    }
      res.status(200).send(result);
    }
    else res.status(400).send(result);
}).catch(function(err){
  console.log(err);
  console.log(err.stack);
  res.status(500).send(err);
});

};

//타이틀변경
exports.change_title = function(req,res){
  co(function*(){
    var where = { sid : Number(req.params.sid) };
    var modify = { $set :{ title : req.body.title }};
    var result = yield model.partialUpdate(where,modify,db.collection('users'));
    if(result.nModified === 1)
      res.status(200).send(result);
    else
      res.status(400).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).send(err);
  });
};

//프로필사진변경
exports.change_profile = function(req,res){
  co(function*(){
    var where = { sid : Number(req.params.sid) };
    var modify = { $set :{ photo : req.body.path }};
    var result = yield model.partialUpdate(where,modify,db.collection('users'));
    if(result.n === 1)
      res.status(200).send(result);
    else
      res.status(400).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).send(err);
  });
};

//email 변경
exports.change_email = function(req,res){
  co(function*(){
    var where = { sid : Number(req.params.sid) };
    var modify = { $set :{ email : req.body.email }};
    var result = yield model.partialUpdate(where,modify,db.collection('users'));

    if(result.nModified === 1)
      res.status(200).send(result);
    else
      res.status(400).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).send(err);
  });
};

//이름변경
exports.change_name = function(req,res){
  co(function*(){
    var where = { sid : Number(req.params.sid) };
    var modify = { $set :{ name : req.body.name }};
    var result = yield model.partialUpdate(where,modify,db.collection('users'));
    if(result.nModified === 1)
      res.status(200).send(result);
    else
      res.status(400).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).send(err);
  });
};

//비밀번호변경
exports.change_password = function(req,res){
  co(function*(){
    var where = { sid : Number(req.params.sid) };
    var pwd = bcrypt.hashSync(req.body.password);
    var modify = { $set :{ password : pwd }};
    var result = yield model.partialUpdate(where,modify,db.collection('users'));
    if(result.nModified === 1)
      res.status(200).send(result);
    else
      res.status(400).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).send(err);
  });
};

//내 관심지역 불러오기
exports.get_mylocation = function(req,res){
  co(function*(){
    var args= {user_sid : Number(req.params.sid)};
    var result = yield model.findDoc(args,db.collection('locations'));
    if(result){
      for(var l in result){
        delete result[l].user_sid;
        delete result[l]._id;
      }
      res.status(200).send(result);
    }
  }).catch(function(){
    console.log(err);
    res.status(500).send(err);
  });
};

//관심지역설정
exports.set_mylocation = function(req,res){
co(function*(){
  var usersid= Number(req.params.sid);
  var initargs = {user_sid : usersid};
  var initmodify = { $pull :  {user_sid : usersid }};
  var init_result= yield model.partialUpdate(initargs, initmodify, db.collection('locations'));
  var arr= req.body.locs;
if(init_result){
  for(var loc in arr){
    var args = { name : arr[loc]};
    console.log(args);
    var modify = { $addToSet : {user_sid : usersid}};
    var set_result = yield model.partialUpdate(args, modify, db.collection('locations'));
    if(set_result.nModified ===0){
      res.status(500).send();
      break;
    }
  }
    res.status(200).send('Completed');
}
}).catch(function(){
  console.log(err);
  res.status(500).send(err);
});

};

//관심태그로드
exports.get_mytag = function(req,res){
  co(function*(){
    var args= {sid : Number(req.params.sid)};
    var result = yield model.findDoc(args,db.collection('users'));
    if(result){
      res.status(200).send(result[0].mytags);
    }
  }).catch(function(){
    console.log(err);
    res.status(500).send(err);
  });
};

//관심태그설정
exports.set_mytag = function(req,res){
co(function*(){
  var usersid= Number(req.params.sid);
  var args = {sid : usersid};
  var modify = { $set :{mytags : req.body.tags}};
  var result = yield model.partialUpdate(args, modify,db.collection('users'));
  if(result.nModified ===1)
    res.status(200).send(result);
}).catch(function(){
  console.log(err);
  res.status(500).send(err);
});
};

//리뷰 신고
exports.report_review= function(req,res){
  co(function*(){
    //사용자, sid , 카페sid, 카페이름, 리뷰 내용.


  }).catch(function(){
    console.log(err);
    res.status(500).send(err);
  });

}

//리뷰 수정
exports.edit_review= function(req,res){


}

//리뷰 삭제
exports.delete_review= function(req,res){

  co(function*(){
    var args = { sid: Number(req.params.rid) };
    var result = yield model.deleteDoc(args, db.collection('reviews'));

    var where = { sid : Number(req.params.cid)};
    var modify = { $inc  : {total_reviews : -1}};
    var result2 = yield model.partialUpdate(where,modify, db.collection('cafeinfos'));

    if(result.nModified===1 && result2.nModified ===1){
      res.status(200).send(result);
    } else res.status(400).send(result);

  }).catch(function(){
    console.log(err);
    res.status(500).send(err);
  });

}
