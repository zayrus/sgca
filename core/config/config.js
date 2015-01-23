/*
 *  core config.js
 *  package: /core/config
 *  Use:
 *     Exporta un objeto con las configuraciones basicas para devel, test, production
 */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');
var publicPath = path.join(rootPath, 'public');
var fs = require('fs');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var user = require(rootPath + '/calendar/controllers/user');



//Installed Dbases
var dbaseDevel = 'mongodb://localhost/sgcadb_dev'; //port = 27017  ojo: {auto_reconnect: true}
var dbaseTest = 'mongodb://localhost/sgcadb_test'; //port = 27017  ojo: {auto_reconnect: true}
var dbaseProd = 'mongodb://localhost/sgcadb';      //port = 27017  ojo: {auto_reconnect: true}

//Installed applications
var mailerTplPth = path.normalize(__dirname + '/mailer/templates'); //ojo
var calendarApp    = rootPath + '/calendar';
var bacuaApp    = rootPath + '/bacua';
var coreApp  = rootPath + '/core';
var apps = [calendarApp, bacuaApp];


//Mailer options
var notifier = {
  APN: false,
  email: false, // true
  actions: ['comment'],
  tplPath: mailerTplPth,
  postmarkKey: 'POSTMARK_KEY',
  parseAppId: 'PARSE_APP_ID',
  parseApiKey: 'PARSE_MASTER_KEY'
};

var instanceDbListeners = function (db,BSON) {
  //loads modules that needs a reference to the db connection
  for(var ix = 0; ix<apps.length; ix++){
      var controllers_path = path.normalize( apps[ix] + '/controllers/');
      fs.readdirSync(controllers_path).forEach(function (file) {
        require(controllers_path+file).setDb(db).setBSON(BSON).setConfig({publicpath:publicPath});
      });
  }
};

var routesBootstrap = function (app, express) {

  passport.use(new LocalStrategy({usernameField: 'username',passwordField: 'password'},
    // verify callback
    function(username, password, done) {
      //console.log('passport verify: username[%s] pass[%s] ',username,password);
      // VERIFY CALLBACK
      //  return done(null, user); // ok
      //  return done(null, false, { message: 'Incorrect username.' }); // ToDo: implementar FLASH
      //  return done(err); // server error
      //  return (new Error('User ' + id + ' does not exist'));
      //  process.nextTick(function () {
      
      user.findOne({ username: username }, function (err, userdao) {
        if (err) { 
          //console.log('passport error');
          return done(err); 
        }
        if (!userdao) {
          //console.log('passport USER NOT FOUND');
          //return done(null, false, { message: 'Incorrect username.' });
          return done(null, false);
        }
        if (!user.validPassword(userdao, password)) {
          //console.log('passport PASSWD ERROR');
          //return done(null, false, { message: 'Incorrect password.' });
          return done(null, false);
        }
        //console.log('passport USER:[%s] ',userdao.username);
        return done(null, userdao);
      });
  
    }
  ));

  passport.serializeUser(function(user, done) {
    //console.log('serialize:[%s]',user.name);
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    //console.log('deserialize:[%s]',id);
    user.fetchById(id, function(err, user) {
      done(err, user);
    });
  });



  app.set('port', 3000);
  app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.cookieParser());
  // deprecated: app.use(express.bodyParser());
  // see: https://github.com/senchalabs/connect/wiki/Connect-3.0
  //https://groups.google.com/forum/#!msg/express-js/iP2VyhkypHo/5AXQiYN3RPcJ
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(publicPath));

  for(var ix = 0; ix<apps.length; ix++){
      var routes_path = path.normalize( apps[ix] + '/config/routes.js');
      require(routes_path)(this, app);
  }
};


module.exports = {
  development: {
    dburi: dbaseDevel,
    coreApp: coreApp,
    apps: apps,
    root: rootPath,
    publicpath: publicPath,
    notifier: notifier,
    connectionListeners: instanceDbListeners,
    routesBootstrap: routesBootstrap,
    app: {
      name: 'SGAC - Desarrollo'
    },
    facebook: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback"
    }
  },
  test: {
    dburi: dbaseTest,
    coreApp: coreApp,
    apps: apps,
    root: rootPath,
    publicpath: publicPath,
    notifier: notifier,
    connectionListeners: instanceDbListeners,
    routesBootstrap: routesBootstrap,
    app: {
      name: 'SGIC - Test'
    },
    facebook: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    twitter: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
    github: {
      clientID: 'APP_ID',
      clientSecret: 'APP_SECRET',
      callbackURL: 'http://localhost:3000/auth/github/callback'
    },
    google: {
      clientID: "APP_ID",
      clientSecret: "APP_SECRET",
      callbackURL: "http://localhost:3000/auth/google/callback"
    }
  },
  production: {}
}
