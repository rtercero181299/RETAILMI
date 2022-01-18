var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');

// modulos que manejan cada end-point
var uploadFile = require('./routes/upload-files');
const registerUser = require('./routes/register-users');
const listVCCValues = require('./routes/list-vcc-values');
const campaniaValues = require('./routes/list-campania-values');
const supervisorValues = require('./routes/list-supervisor-values');
const estadosValues = require('./routes/estados-values');
const listAgentes = require('./routes/list-agentes');
const checkCp = require("./routes/check-cp");
const listTiposUsuario = require('./routes/list-tipos-usuario')
const getHistorical = require('./routes/get-historic');
const searchUsers = require('./routes/search-users')
const listAllUsers = require('./routes/list-all-users')
const listSupervisores = require('./routes/list-supervisores')
const modifyUser = require('./routes/modify-user')
const deleteuser = require('./routes/delete-user')
const registerCompany = require('./routes/register-company');
const registerExperience = require('./routes/register-experience');
const listAllExperiences = require('./routes/list-all-experiences');
const modifyExperience = require('./routes/modify-experience');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({limit: '1024mb'}));
app.use(express.urlencoded({limit: '1024mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet.frameguard())
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Request-Method');
//     res.header('Access-Control-Allow-Methods', 'POST');

//   next();
// });

app.use('/upload-file', uploadFile);
app.use('/register-user', registerUser);
app.use('/modify-user', modifyUser);
app.use('/modify-user', modifyUser);
app.use('/respuesta', listVCCValues);
app.use('/campania', campaniaValues);
app.use('/supervisor', supervisorValues);
app.use('/estados', estadosValues);
app.use('/list-agentes', listAgentes);
app.use('/validar-cp', checkCp);
app.use('/tipos-usuario', listTiposUsuario);
app.use('/get-historical-times', getHistorical);
app.use('/search-users', searchUsers);
app.use('/list-all-users', listAllUsers);
app.use('/list-supervisores', listSupervisores);
app.use('/delete-user', deleteuser)
app.use('/register-company', registerCompany)
app.use('/register-experience', registerExperience)
app.use('/list-all-experiences', listAllExperiences)
app.use('/modify-experience', modifyExperience)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
