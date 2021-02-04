const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const expressSession = require('express-session');
const pgSession = require('express-pg-session')(expressSession);
const config = require('./config/config');
const favicon = require('serve-favicon');

const app = express();


// setup config object
config.app = app;
config.deps = {};
config.deps.express = express;
config.deps.passport = passport;
config.deps.sql = require('./helpers/db.js');
config.deps.rest = require('./helpers/rest.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const envtype = app.get('env') === 'development' ? 'd' : 'e';

// initialize passport
app.use(expressSession({
	name: "jsPratiche"+envtype,
	key: "jsPratiche"+envtype,
	store: new pgSession({
		pool : config.deps.sql.pool,                // Connection pool
		conString : 'postgresql://' + config.db.user + ':' + config.db.password + '@' + config.db.host + '/' + config.db.database,
		tableName : config.deps.sql.tables.SessionsName,   // Use another table-name than the default "session" one
		schemaName : config.deps.sql.tables.SessionsSchema,
		columns : {
			session_id: config.deps.sql.tables.SessionsColumnID,
			session_data: config.deps.sql.tables.SessionsColumnData,
			expire: config.deps.sql.tables.SessionsColumnExpire,
		  }
	  }),
	secret: config.secret,
	// proxy: true,
	resave: false,
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
// app.use(favicon(path.join(__dirname, 'client', 'imgs', 'favicon.ico')));
app.use(favicon(path.join(__dirname, '..', 'dist', 'imgs', 'favicon.ico')));

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

console.log('Application START');
