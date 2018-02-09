var co = require('co');
var config = require('../app/config');
var mongoClient = require('mongodb').MongoClient;
var db;
var conllection;

mongoClient.connect(config.connectionString, function (err, database) {
    if (err)
        console.log(err)
    else {
        db = database
    }
})



function getNextSequence(name) {
  return new Promise( function(resolve, reject) {
      co(function*() {
           var ret = yield db.collection('counters').findOneAndUpdate(
                    { _id: name },
                    { $inc: { seq: 1 } },
                    {new: true,upsert: true}
           );
           //console.log(ret);
          resolve(ret.value.seq);
        }).catch(function(err){
            reject(err);
         });
});
}
exports.findOneDoc = function(args, col){
    return new Promise(function(resolve, reject){
      co(function*(){
        var result= yield col.findOne(args);
        resolve(result);
      }).catch(function(err){
        reject(err);
      });
    });
};


exports.partialUpdate = function(where,modify,col){
  return new Promise(function(resolve,reject){
    co(function*(){
      var result= yield col.update(where,modify,{ upsert:true, multi:true});
      resolve(result.result);
    }).catch(function(err){
        reject(err);
    });
  });

};

exports.findDoc = function (args ,col){
  return new Promise(function(resolve,reject){
    co(function*(){

      var docs = yield col.find(args).toArray();
      if(docs.length === 0){
        resolve(false);
      }
      else{
          resolve(docs);
      }
    }).catch(function(err){ reject(err);});
  });
}


exports.insertDoc = function (doc, col,sname){
  return new Promise(function (resolve,reject){
    co(function*(){
      doc.sid= yield getNextSequence(sname);
      var result = yield col.insert(doc);
      result.result.sid=doc.sid;
      resolve(result.result);
    }).catch(function(err){
      reject(err);
    });
  });
}

exports.deleteDoc = function(args, col){
  return new Promise(function (resolve,reject){
    co(function*(){
    var result =yield col.deleteOne(args);
    resolve(result.result);
  }).catch(function(err){
    reject(err);
  });
});
}



exports.updateDoc = function(args, doc, col){
  return new Promise(function (resolve, reject){
    co(function*(){
      var result = yield col.update(args,doc);
      resolve(result.result);
    }).catch(function (err){
      reject(err);
    });
  });
}

exports.list = function(page, rows,args, col){
return new Promise(function (resolve, reject){
  co(function*(){
    var docs =  col.find(args);
    var count =yield docs.count();
    var result =yield docs.sort({date: -1}).skip(rows * (page-1)).limit(rows).toArray();
    //console.log(result);
    resolve({totalcount : count,  docs : result});
  }).catch(function(err){
    reject(err);
  });
});

}
