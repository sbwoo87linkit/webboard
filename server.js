var logger          = require('morgan'),
    cors            = require('cors'),
    http            = require('http'),
    express         = require('express'),
    errorhandler    = require('errorhandler'),
    dotenv          = require('dotenv'),
    path            = require('path'),
    bodyParser      = require('body-parser');
    // multer          = require('multer')

var app = express();


console.log('test');

dotenv.load();

// Parsers
// old version of line
// app.use(bodyParser.urlencoded());
// new version of line

app.use(bodyParser({limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
// app.use(multer({ dest: './uploads/'}))

app.use('/', express.static('public'));
app.use('/files', express.static(path.join(__dirname, '/uploads')));
app.use(function(err, req, res, next) {
  if (err.name === 'StatusError') {
    res.send(err.status, err.message);
  } else {
    next(err);
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
  app.use(errorhandler())
}

require('./app/routes')(app);

// app.use(require('./anonymous-routes'));
// app.use(require('./protected-routes'));
// app.use(require('./user-routes'));

var port = process.env.PORT || 1337;

http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});




// #!/usr/bin / env nodejs

// var http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {
//     'Content-Type': 'text/plain'
//   });
//   res.end('sbwoo... #6');
// }).listen(1337, 'localhost');
// console.log('Server running at http://localhost:1337/');
