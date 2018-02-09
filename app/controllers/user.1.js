var config = require('../config');
var mongoClient = require('mongodb').MongoClient;
var bcrypt = require("bcrypt-nodejs");
var jwt     = require('jsonwebtoken');
var co = require('co');
var model = require('../../models/model');



var db;
var collection;


function createToken(user) {
    // return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*5 });
    return jwt.sign(user, config.secret, { expiresIn: 60*60*5 });
}

mongoClient.connect(config.connectionString, function (err, database) {
    if (err)
        console.log(err);
    else {
        db = database;
    }
});



exports.login = function (req, res) {
      co(function*(){
        var args = {email : req.body.email};
        var result=yield model.findOneDoc(args, db.collection('users'));
          if (!bcrypt.compareSync(req.body.password, result.password) ) {
              return res.status(401).send("Autheication failed");
          }
          delete result.password;
          var lastlogin = yield model.partialUpdate(args,{$set:{last_login : new Date()}},db.collection('users'));
          if(lastlogin.n===1){
            var token = createToken(result);
            console.log(token);
          res.status(201).send({
              id_token: token
          });
        }
      }).catch(function(err){
        console.log(err);
        console.log(err.stack);
        res.status(500).end();
      });

};


//회원가입은 role지정. 바로 가입
exports.signup = function (req, res) {

    // return res.status(200).end('signup');

    if (!req.body.email || !req.body.password) {
        return res.status(400).send("You must send the email and the password");
    }
    co(function*(){
        var args = {email : req.body.email};
        var valid = yield model.findDoc(args, db.collection('users'));
        if(!valid) {
            req.body.password = bcrypt.hashSync(req.body.password);
            req.body.created = new Date();
            var result= yield model.insertDoc(req.body, db.collection('users'), 'userid');
            if(result){
                res.status(200).send(result);
            }else res.status(500).send('Internal Error');
        }  else res.status(409).send('Duplicate error');
    }).catch(function(err){
        console.log(err);
        console.log(err.stack);
        res.status(500).end();
    });

};

//회원가입은 role지정. 바로 가입
exports.list = function (req, res) {

    // return res.status(200).end('userlist');

    // co(function*() {
    //     var args;
    //     // console.log("ARGS --- ", args);
    //     var result= yield model.list(Number(req.query.page), Number(req.query.rows), args, db.collection('users'));
    //     res.status(200).send(result);
    // }).catch(function(err) {
    //     console.log(err);
    //     console.log(err.stack);
    //     res.status(400).end();
    // });

    // db.collection('users').find()

    db.collection('users').find({ role: { $ne: 'admin' } }).sort({"_id": -1}).toArray(function(err, results) {
        console.log(results)
        // send HTML file populated with quotes here
        res.status(200).send(results);
    })

};





//페이스북 로그인
exports.login_facebook = function(req,res){
  co(function*(){
      //check FBtoken
      if(req.body.token){
      //join
      var args = {id : req.body.id};
      var valid = yield model.findOneDoc(args, db.collection('users'));
      if(!valid) { //인증은 되었으나, 서버에 정보가 없는 경우.(회원가입)
        req.body.created = new Date();
        req.body.age_range= Number(req.body.age_range);
        var result= yield model.insertDoc(req.body, db.collection('users'), 'userid');
        if(result){
          var lastlogin = yield model.partialUpdate(args,{$set:{last_login : new Date()}},db.collection('users'));
          var userinfo = yield model.findOneDoc(args, db.collection('users'));
          if(userinfo && lastlogin.nModified===1){
            delete userinfo.password;
            res.status(201).send({id_token:createToken(userinfo)});
        }
      }else res.status(400).send();
     }else { //login
          var lastlogin = yield model.partialUpdate(args,{$set:{last_login : new Date()}},db.collection('users'));
          if(lastlogin.n===1){
            delete valid.password;
            res.status(201).send({
                id_token: createToken(valid) //return server token
            });
        }
      }
  }

  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).end();
  });

}


//카카오 로그인
exports.login_kakao = function(req,res){

}



exports.deleteuser = function (req,res){
  co(function*(){
    var uid = Number(req.params.sid);
  var r1=  yield model.deleteDoc({sid : uid}, db.collection('users'));
  var r2=  yield model.partialUpdate({},{$pull : {user_sid : uid}}, db.collection('titles'));//타이틀해제
  var r3=  yield model.partialUpdate({},{$pull : {user_sid : uid}}, db.collection('locations'));//관심지역해제
  //var r4= yield model.partialUpdate({},{$pull : {user_sid : uid}}, db.collection('reviews'));//리뷰 삭제
  // yield model.partialUpdate({},{$pull : {get : uid}}, db.collection('coupons'));
  var r5= yield model.partialUpdate({},{$pull :{ "favorite_by" : uid} }, db.collection('cafeinfos'));//찜하기 삭제
  if(r5.nModified===1){
    var r6= yield model.partialUpdate({},{ $inc : { "total_favorites":-1 }}, db.collection('cafeinfos')); //찜하기 삭제
  }
    if(r1 &&r2 &&r3 &&r5){
      res.status(200).send('Completed');
    }
    else
      res.status(500).end();
  }).catch(function(err){
    console.log(err);
    res.status(500).end();
  });
}
exports.logout = function (req, res) {

    var a;
    res.status(200).send('ok')
};

exports.findId = function(req,res){
  co(function*(){
    var birth=req.body.year +'-' +req.body.month + '-'+ req.body.day;
    var args = { $and : [{ name : req.body.name},{ birthday : birth }] };
    var result = yield model.findDoc( args, db.collection('users'));
    if(result)
      res.status(200).send(result[0].email);
    else res.status(406).send('Wrong Info');
  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).end();
  });
};

exports.findPass = function(req,res){
  co(function*(){
    //email 전송. NodeMailer

  }).catch(function(err){
    console.log(err);
    console.log(err.stack);
    res.status(500).end();
  });
};
