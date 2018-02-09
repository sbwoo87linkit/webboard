var jwt = require('express-jwt');
var config = require('./config');
// var fs = require('fs');

var jwtCheck = jwt({
    secret: config.secret
});

var board = require('./controllers/board.js');
var user = require('./controllers/user.js');
// var restapi = require('./controllers/restapi.js');
// var admin = require('./controllers/admin.js');
// var manager = require('./controllers/manager.js');
// var client = require('./controllers/client.js');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var fileName = file.originalname.substr(0, file.originalname.lastIndexOf('.'));
        var fileExt = file.originalname.substr(file.originalname.lastIndexOf('.'));

        cb(null, fileName + '-' + Date.now() + fileExt);
    }
});

var upload = multer({storage: storage});

module.exports = function (app) {
    app.post('/api/files', upload.single('file'), function (req, res) {
        console.log('zzzzzz', req.file);
        res.send(req.file.filename)
    });

    // app.get('/board', function(req, res) {
    //     res.send("OK");
    // })


    // const asyncHandler = require('express-async-handler')

    // app.get('/board', asyncHandler(async (req, res, next) => {
    //     const bar = await board.list();
    //     console.log('bar', bar)
    //     res.send(bar);
    // }))


    app.get('/board', board.list);
    app.get('/board/:sid', board.view);
    app.post('/board', board.create);
    app.put('/board/:sid', board.update);
    app.delete('/board/:sid', board.delete);

    app.post('/user/login', user.login);
    app.post('/user/signup', user.signup);
    app.get('/user/list', user.list);


};

