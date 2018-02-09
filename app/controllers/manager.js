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
});


//업주가 카페 등록 신청.
exports.cafe_request_new = function ( req, res){

  co(function*() {
          var args = { name : req.body.cafeinfo.name};
          var valid = yield model.findDoc(args, db.collection('cafeinfos')); //카페 중복검사
          if(!valid){
            var result= yield model.insertDoc( req.body, db.collection('cafe_requests'),'cafe_request_id');
            if(result.n===1)
              res.status(200).send(result);
            else
              res.status(400).send(result);
          }else
            res.status(409).send('Cafe Duplicate Error');
      })
    .catch(function(err) {
            console.log(err.stack);
            res.status(500).end();
    });
};

//카페 관리 (내카페)
exports.cafe_manage = function(req,res){
  co(function*(){
    var args= { sid  : Number(req.params.sid)};
    var manager = yield model.findDoc(args, db.collection('users'));
    if(manager){
      if(manager[0].cafe_sid){//사용자 카페가 있는경우.
        var cafeinfo = yield model.findDoc({sid : Number(manager.cafe_sid)},db.collection('cafeinfos'));
        if(cafeinfo){
          res.status(200).send(cafeinfo[0]);
        }else res.status(400).send('Can not Found');
      }else { //등록이 필요한 경우.
        res.status(404).send('Enroll Your Cafe First.');
      }
    }
  }).catch(function(err){
    console.log(err.stack);
    res.status(500).end();
  });

}

//카페 수정
exports.cafe_edit = function(){
  co(function*(){
    var args= { sid  : Number(req.params.sid)};
    var modify = req.body;
    var result = yield model.updateDoc(args, modify, db.collection('cafeinfos'));
    if(result.nModified ===1){
      res.status(200).send(result);
    }else res.status(400).end();
  }).catch(function(err){
    console.log(err.stack);
    res.status(500).end();
  });
};

//지난 광고내역
exports.before_ad_view = function(req,res){
  co(function*(){

  }).catch(function(err){
    console.log(err.stack);
    res.status(500).end();
  });

};
//현재광고 관리
exports.current_ad_view = function(req,res){
  co(function*(){
    var today = new Date();
    var args = {$and :[{user_sid: Number(req.params.sid) },{start : {$lt :today}} ,{end: { $gt :today} } ] };// 진행중인 광고가 잇는지. 확인.
    var result = yield model.findDoc(args,db.collection('ads'));
    if(result ) res.status(200).send(result);
    else res.status(200).send('No Result');
  }).catch(function(err){
    console.log(err.stack);
    res.status(500).end();
  });

};

//광고 신청
exports.ad_request_new = function(req,res){
  co(function*(){
    var adtype= req.body.type=="list"?"list":"top";
    var args = {$and :[{cafe_sid: Number(req.body.cafe_sid) },{end : {$gt :new Date(req.body.start)}}, {type :adtype} ]};// 진행중인 광고가 잇는지. 확인.
    var valid= yield model.findDoc(args, db.collection('ads'));
    var valid2= yield model.findDoc(args, db.collection('ad_requests'));
    if(!valid && !valid2) {
      req.body.clicked= Number(req.body.clicked);
      req.body.cafe_sid= Number(req.body.cafe_sid);
      req.body.start=new Date(req.body.start);
      req.body.end=new Date(req.body.end);
      var result = yield model.insertDoc(req.body, db.collection('ad_requests'),'ad_requests_id');
      res.status(200).send();
    }
    else {
      res.status(409).send('Already Has The Ad.');
    }
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(400).end();
  });
};

//쿠폰 신청
exports.coupon_request_new =function(req,res){
  co(function*(){
    var args = { sid: Number(req.body.cafe_sid) };
    var valid= yield model.findDoc(args, db.collection('cafeinfos'));//신청한 카페를 조회해서,
    if(!valid) res.status(400).send('Can Not Found The Cafe.');
    else if(!valid[0].coupon){//쿠폰이 없다면 신청가능.
    var result = yield model.insertDoc(req.body, db.collection('coupon_requests'),'coupon_requests_id');
      res.status(200).send(result);
    }
    else res.status(400).send('Invalid Coupon.');
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(400).end();
  });

};


//내 문의

//문의하기.

//리뷰관리



//카페통계
//광고성과통계
