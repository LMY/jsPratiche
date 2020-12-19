const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
console.log('hello world 1');
const passport = require('passport');
console.log('hello world 2');
const expressSession = require('express-session');
const mysqlstore = require('express-mysql-session')(expressSession);
const pgstore = require('express-pg-session')(expressSession);
const config = require('./config/config');
const favicon = require('express-favicon');

const app = express();

console.log('hello world 3');

// setup config object
config.app = app;
config.deps = {};
config.deps.express = express;
config.deps.passport = passport;
config.deps.sql = require('./helpers/db.js');
config.deps.rest = require('./helpers/rest.js');

console.log('hello world 4');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const envtype = app.get('env') === 'development' ? 'd' : 'e';

console.log('hello world 5');
 
var sessionStore = 
config.db.type=="mysql" ?
new mysqlstore({
		checkExpirationInterval: 900000,	// How frequently expired sessions will be cleared; milliseconds. 
		expiration: 86400000,				// The maximum age of a valid session; milliseconds. 
		createDatabaseTable: true,			// Whether or not to create the sessions database table, if one does not already exist. 
		connectionLimit: 1,					// Number of connections when creating a connection pool 
		schema: {
			tableName: 'sessions',
			columnNames: {
				session_id: 'id',
				expires: 'expires',
				data: 'data'
			}
		}
	}, config.deps.sql.pool) :
	new pgstore({
		checkExpirationInterval: 900000,	// How frequently expired sessions will be cleared; milliseconds. 
		expiration: 86400000,				// The maximum age of a valid session; milliseconds. 
		createDatabaseTable: true,			// Whether or not to create the sessions database table, if one does not already exist. 
		connectionLimit: 1,					// Number of connections when creating a connection pool 
		schema: {
			tableName: 'sessions',
			columnNames: {
				session_id: 'id',
				expires: 'expires',
				data: 'data'
			}
		}
	}, config.deps.sql.pool);


// initialize passport
if (config.db.type=="mysql")
	app.use(expressSession({
		secret: config.secret,
		name: "jspratiche"+envtype,
		key: "jspratiche"+envtype,
		store: sessionStore,
		proxy: true,
		resave: true,
		saveUninitialized: true
	//	cookie: { secure: true }		// requires HTTPS
	}));
else
app.use(expressSession({
	// store: new pgSession({
	//   pool : config.deps.sql.pool,                // Connection pool
	//   tableName : 'user_sessions'   // Use another table-name than the default "session" one
	// }),
	secret: config.secret,
	name: "jspratiche"+envtype,
	key: "jspratiche"+envtype,	
	store: sessionStore,
	proxy: true,
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
  }));
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
require('./helpers/passport')(passport);

app.use(morgan('dev'));
app.use(morgan(':date[iso] :method :url :status :response-time ms - :res[content-length]'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(favicon(path.join(__dirname, 'client', 'imgs', 'favicon.ico')));


// routes
require('./routes/index')(config, './server/routes');


// 500 development error handler, will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}
// 500 production error handler, no stacktraces leaked to user
else {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
	});
}
module.exports = app;
