var config = require('../config');
var mongoClient = require('mongodb').MongoClient;
//var bcrypt = require("bcrypt-nodejs");
var jwt = require('express-jwt');
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
})


//카페 리스트
exports.cafe_list = function (req, res) {
  co(function*() {
    var args;
    if(req.query.keyword){
      args={ name: {$regex : req.query.keyword}};
    }
    var result= yield model.list(  Number(req.query.page),Number(req.query.rows),args, db.collection('cafeinfos'));
    res.status(200).send(result);
  }).catch(function(err) {
    console.log(err);
    console.log(err.stack);
            res.status(400).end();
  });
};
//카페 상세보기
exports.cafe_view =function(req, res){
  co(function*() {
    var args = { sid : Number(req.params.sid)};
    var result= yield model.findDoc(  args , db.collection('cafeinfos'));
    if(!result)
      res.status(404).end('Can not found.' );
    else{
      var coupon_args ={ sid : result[0].ofCoupon };
      var coupon = yield model.findDoc(coupon_args, db.collection('coupons'));
      result[0].ofCoupon = coupon;
      res.status(200).send(result[0]);
    }
  }).catch(function(err) {
    console.log(err);
    console.log(err.stack);
            res.status(400).end();
  });

};


//카페 생성
exports.cafe_create = function (req, res) {

    if (!req.body.name) {
        return res.status(400).send("You must write cafe's name");
    }

    co(function*() {
        var args = {name : req.body.name};
          var valid = yield model.findDoc(args, db.collection('cafeinfos') );
          if(!valid){
            var result= yield model.insertDoc(  req.body,  db.collection('cafeinfos') ,'cafeid');

            if(result.n ===1)
              res.status(200).send(result);
            else res.status(400).send(result);
        }
          else res.status(409).end('Duplicate Error');
        })
      .catch(function(err) {
        console.log(err);
        console.log(err.stack);
              res.status(400).end();
      });
};


//카페 삭제
exports.cafe_remove =function (req,res){
  co(function*(){
    var args = {sid : Number(req.params.sid)};
    var result = yield model.deleteDoc(args, db.collection('cafeinfos'));
    if(result.n ===1)
      res.status(200).send(result);
    else res.status(400).send(result);
  })
  .catch(function(err) {
    console.log(err);
    console.log(err.stack);
            res.status(400).end();
    });
};

//카페 업데이트
exports.cafe_update =function (req,res){
  co(function*(){
    var args= {sid : Number(req.params.sid)};
    var result = yield model.updateDoc(args, req.body, db.collection('cafeinfos'));
    if(result.n ===1)
      res.status(200).send(result);
    else res.status(400).send(result);
  })
  .catch(function(err) {
    console.log(err);
    console.log(err.stack);
            res.status(400).end();
    });
};



//카페 승인요청 리스트
exports.cafe_request_list = function(req,res){
  co(function*(){
    var result= yield model.list(Number(req.query.page),Number(req.query.rows),{}, db.collection('cafe_requests'));

    if(!result)
      res.status(200).send('No Result');
    else
      res.status(200).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(400).end();
  });
};



//카페 승인요청 상세보기
exports.cafe_request_view = function (req,res){
  co(function*(){
    var args = { sid : Number(req.params.sid)};
    var result = yield model.findDoc(args, db.collection('cafe_requests'));
    if (!result)
      res.status(404).send('Can Not Found');
    else
      res.status(200).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(400).end();
  })

};


//카페 승인
exports.cafe_request_approve = function (req,res){
  //1. 승인할 요청의 시퀀스번호 게시물 찾아서
  //2.게시물의 내용을 cafeinfo에 insert,
  // 3.cafe approve doc 내에서 승인한 게시물은 delete

  co(function*() {
        var args = { sid : Number(req.params.sid) };
        var doc = yield model.findDoc( args , db.collection('cafe_requests') ); //요청을 찾아서
        if(doc){
          var valid = yield model.findDoc({name :doc[0].cafeinfo.name}, db.collection('cafeinfos') );
          var modify;
          if(!valid){
            var result1 = yield model.insertDoc( doc[0].cafeinfo , db.collection('cafeinfos'),'cafeid' ); //신규이면 카페를 삽입
            modify= {$set : {cafe_name : doc[0].cafeinfo.name, cafe_sid : result1.sid}};
          }else
            modify= {$set : {cafe_name : doc[0].cafeinfo.name, cafe_sid : valid[0].sid}};
          var where = {name:doc[0].manager_name, sid:Number(doc[0].manager_sid)};
          var result2 = yield model.partialUpdate(where, modify, db.collection('users'));//관리자와 카페 매핑
          var result3= yield model.deleteDoc( args,db.collection('cafe_requests')); //삭제

          if(result2.n===1 && result3.n===1)
            res.status(200).send(result3);
          else res.status(400).end();

      }
      })
    .catch(function(err) {
      console.log(err);
      console.log(err.stack);
            res.status(400).end();
    });
};

//카페 반려
exports.cafe_request_reject = function (req,res){
  //1. 승인할 요청의 시퀀스번호 게시물 찾아서
  //2. 반려 사유와 상세 내용을 저장. (사유, 상세내용, 요청자)
  //3. 삭제

  co(function*() {
        var args = { sid : Number(req.params.sid) };
        var doc = yield model.findDoc( args , db.collection('cafe_requests') );
        req.body.manager_email= doc[0].manager_email;
        req.body.manager_name = doc[0].manager_name;
        req.body.cafeinfos = doc[0].cafeinfos;
        var result1 = yield model.insertDoc( req.body , db.collection('cafe_requests_rejects'),'cafe_reject_id' ); //삽입
        var result2= yield model.deleteDoc( args,db.collection('cafe_requests')); //삭제

        if (result1.n===1 && result2.n===1)
          res.send(result2);
        else  res.status(400).end();
      })
    .catch(function(err) {
      console.log(err);
      console.log(err.stack);
            res.status(400).end();
    });
};


//쿠폰 신청 리스트
exports.coupon_request_list = function(req,res){
  co(function*(){
    var result= yield model.list(Number(req.query.page),Number(req.query.rows),{}, db.collection('coupon_requests'));

      res.status(200).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(400).end();
  });
};

//쿠폰 승인
exports.coupon_request_approve = function (req,res){
    //1. 승인할 쿠폰 요청의 시퀀스번호 게시물 찾아서
    //2.게시물의 쿠폰내용을 coupon에 insert, cafeinfo의 coupon에 update.
    // 3.coupon approve doc 내에서 승인한 게시물은 delete

    co(function*() {
          var args = { sid : Number(req.params.sid) };
          var doc = yield model.findDoc( args , db.collection('coupon_requests') );
          if(doc){
            doc[0].EA= Number(doc[0].EA);
            var where = {sid : Number(doc[0].cafe_sid) };
            var result = yield model.insertDoc(doc[0], db.collection('coupons'),'couponid');//쿠폰삽입.

            if(result.n===1){
            var modify = { $set:{ ofCoupon : result.sid }}; //현재 쿠폰
            var result1 = yield model.partialUpdate(where,modify,db.collection('cafeinfos')); //카페의 현재쿠폰으로 삽입
            var result2= yield model.deleteDoc( args,db.collection('coupon_requests')); //삭제
            if (result1.n===1 && result2.n===1)
              res.status(200).send(result2);
            else  res.status(400).end();
          }
        }
          else  res.status(400).end();
        })
      .catch(function(err) {
        console.log(err);
        console.log(err.stack);
              res.status(400).end();
      });
};

//쿠폰 반려
exports.coupon_request_reject = function (req,res){
  //1. 승인할 요청의 시퀀스번호 게시물 찾아서
  //2. 반려 사유와 상세 내용을 저장. (사유, 상세내용, 요청자)
  //3. 삭제

  co(function*() {
        var args = { sid : Number(req.params.sid) };
        var doc = yield model.findDoc( args , db.collection('coupon_requests') );
        req.body.coupon = doc[0];
        var result1 = yield model.insertDoc( req.body , db.collection('coupon_requests_rejects'),'coupon_reject_id' ); //삽입
        var result2= yield model.deleteDoc( args,db.collection('coupon_requests')); //삭제
        console.log(result1);
        console.log(result2);
        if (result1.n===1 && result2.n===1)
          res.send(result2);
        else  res.status(400).end();
      })
    .catch(function(err) {
      console.log(err);
      console.log(err.stack);
            res.status(400).end();
    });
};




//타이틀 추가
exports.title_create = function (req,res){
  co(function*(){
    req.body.ofUserCount=0;
    var result = yield model.insertDoc(req.body, db.collection('titles'), 'title_id');
    if(result.n ===1)
      res.status(200).send(result);
    else res.status(400).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(400).end();
  });
};

//타이틀 조회
exports.title_view = function (req,res){
  co(function*(){
    var args = {sid : Number(req.params.sid) };
    var result = yield model.findDoc(args, db.collection('titles'));
    if(!result) res.status(400).end();
    else res.status(200).send(result[0]);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(400).end();
  });
};
//타이틀 리스트
  exports.title_list = function (req,res){
    co(function*(){
      var result= yield model.list(Number(req.query.page),Number(req.query.rows),{}, db.collection('titles'));

      res.status(200).send(result);
    }).catch(function(err){
      console.log(err);
      console.log(err.stack);
      res.status(400).end();
    });
};
//타이틀 수정
exports.title_update = function (req,res){
  co(function*(){
    var args={ sid : Number(req.params.sid) };
    req.body.sid = Number(req.params.sid);
    var result= yield model.updateDoc(args, req.body, db.collection('titles'));
    if(result.n ===1)
      res.status(200).send(result);
    else res.status(400).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(400).end();
  });
};
  //타이틀 삭제
  exports.title_delete = function (req,res){
    co(function*(){
      var args = {sid : Number(req.params.sid)};
      var result =yield model.deleteDoc(args, db.collection('titles'));
      if(result.n ===1)
        res.status(200).send(result);
      else res.status(400).send(result);
    }).catch(function(err){
      console.log(err);
      console.log(err.stack);
      res.status(400).end();
    });
};


//정보 수정 요청 리스트
exports.modify_request_list = function (req,res){
  co(function*(){
      var result= yield model.list(Number(req.query.page),Number(req.query.rows),{}, db.collection('modify_requests'));
      res.status(200).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(400).end();
  });
};
//정보 수정 요청 조회
exports.modify_request_view = function (req,res){
  co(function*(){
    var args ={ sid : Number(req.params.sid)};
    var result = yield model.findDoc(args, db.collection('modify_requests'));
    if(! result) res.status(400).end();
    else res.status(200).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(400).end();
  });
};

//정보 수정 요청 반려
exports.modify_request_reject = function (req,res){
  co(function*(){
    var where = { sid : Number(req.params.sid)};
    var modify = { $set : {completed : "반려" } };
    var result = yield model.partialUpdate(where,modify, db.collection('modify_requests'));
    if(result.n ===1)
      res.status(200).send(result);
    else res.status(400).send(result);
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(400).end();
  });
};


    //정보 수정 요청 처리
    exports.modify_request_approve = function (req,res){
      co(function*(){
        var where = { sid : Number(req.params.sid)};
        var modify = { $set : {completed : "처리완료"} };
        var result = yield model.partialUpdate(where,modify, db.collection('modify_requests'));
        if(result.n ===1)
          res.status(200).send(result);
        else res.status(400).send(result);
      }).catch(function(err){
        console.log(err);
        console.log(err.stack);
        res.status(400).end();
      });
    };

/*
    //카페 관리자 요청 리스트
    exports.manager_request_list = function(req,res){
      co(function*(){
        var result = yield model.list(Number(req.query.page),Number(req.query.rows),{}, db.collection('manager_requests'));

        res.status(200).send(result);
      })
      .catch(function(err){
        console.log(err);
        console.log(err.stack);
        res.status(400).end();
      });

    };

    //카페 관리자 요청 승인


    1. 관리자가 가입
    2. 카페를 선택
    3. 선택한 카페의 관리자로 요청

    exports.manager_request_approve = function(req,res){
      co(function*(){
        var args= { sid : Number(req.params.sid)};
        var request = yield model.findDoc( args , db.collection('manager_requests')); //요청검색
        if(request){
            var args1 ={ sid:request[0].manager_sid, name : request[0].manager_name };
            var modify = {$set :{cafe_name : request[0].cafe_name , cafe_sid : request[0].cafe_sid }};
            var result = yield model.partialUpdate(args1, modify, db.collection('users')); //해당 관리자에 관리카페를 부여
            if(result.n ===1){
              var result1 = yield modle.deleteDoc(args ,db.collection('manager_requests'));
              if(result1.n===1) res.status(200).send(result);
              else res.status(400).send('Can not Delete The Request');
            }else
              res.status(400).send('Can not Approve.');
        }
        else
           res.status(400).send();
      })
      .catch(function(err){
        console.log(err);
        console.log(err.stack);
        res.status(400).end();
      });

    };
*/

//공지사항 등록
    exports.notice_create = function(req,res){
      co(function*(){
        var result =  yield model.insertDoc(req.body, db.collection("notices"),'noticeid');
        if(result.n===1) res.status(200).send(result);
        else res.status(400).send(result);
      }).catch(function(err){
        console.log(err);
        console.log(err.stack);
        res.status(400).end();
      });
    };

//공지사항 리스트
    exports.notice_list = function(req,res){
      co(function*(){
        var args={};
        if(req.query.keyword){
          args={ title: {$regex : req.query.keyword}};
        }
        var result =  yield model.list(Number(req.query.page),Number(req.query.rows),args, db.collection("notices"));

        res.status(200).send(result);
      }).catch(function(err){
        console.log(err);
        console.log(err.stack);
        res.status(400).end();
      });
    };
//공지사항 조회
    exports.notice_view = function(req,res){
      co(function*(){
        var args = { sid : Number( req.params.sid)};
        var result =  yield model.findDoc(args, db.collection("notices"));
        if(!result)
         res.status(400).send(result);
        else res.status(200).send(result);
      }).catch(function(err){
        console.log(err);
        console.log(err.stack);
        res.status(400).end();
      });
    };
//공지사항 삭제
    exports.notice_delete = function(req,res){
      co(function*(){
        var args = {sid : Number(req.params.sid)}
        var result =  yield model.deleteDoc(args , db.collection("notices"));
        if( result.n ===1)
        res.status(200).send(result);
        else res.status(400).send(result);
        }).catch(function(err){
        console.log(err);
        console.log(err.stack);
        res.status(400).end();
      });
    };
//공지사항 수정
    exports.notice_update = function(req,res){
      co(function*(){
        var args = { sid : Number(req.params.sid)};
        var result =  yield model.updateDoc(args, req.body, db.collection("notices"));
        if(result.n===1) res.status(200).send(result);
        else res.status(400).send(result);
      }).catch(function(err){
        console.log(err);
        console.log(err.stack);
        res.status(400).end();
      });
    };

    //광고요청 리스트
    exports.ad_request_list =function(req, res){
      co(function*(){
        var result = yield model.list(Number(req.query.page),Number(req.query.rows),{}, db.collection('ad_requests'));
        res.status(200).send(result);
        }).catch(function(err){
        console.log(err);
        console.log(err.stack);
        res.status(400).end();
      });

    };

    //광고요청 조회
    exports.ad_request_view = function(req,res){
      co(function*(){
        var args= {sid : Number(req.params.sid)};
        var result = yield model.fincDoc(args, db.collection('ad_requests'));
        if( !result) res.status(400).send(result);
        else res.status(200).send(result);
      }).catch(function(err){
        console.log(err);
        console.log(err.stack);
        res.status(400).end();
      });
    };

    //광고요청 승인
    exports.ad_request_approve = function(req,res){

    };

    //광고요청 거절
    exports.ad_request_reject = function(req, res){


    };

    //광고카페 리스트
    exports.ad_list =function(req,res){

    };


//리뷰 신고 삭제

//리뷰 신고 조회


//관리자 문의 조회

//관리자 문의 답변

//관리자 문의 삭제

//관리자 문의 조회


//카페통계 조회

//검색 메뉴통계

//검색 지역통계

//검색 태그 통계

//검색 카페 통계

//광고 카페 통계


//회원 성별 통계

//회원 관심지역 통계

//회원 관심태그 통계
