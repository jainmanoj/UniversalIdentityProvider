const path = require('path');

const Provider = require('oidc-provider');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
// const cors = require('cors')       // ONly allow if you want to suport CORS feature
// const reactViews = require('express-react-views');

const interactionapis = require('./apis/interactionApis');
const msgapis = require('./apis/msgApi');
const samlapis = require('./authproviders/saml/samlroutes');


const viewApis =  require('./reactviewctrl/viewRoutes');

const keystore = require('./keystore.json');
const { config, clients, certificates } = require('./settings');

const dbconfig = require('../../config');
// connect to the database and load models
require('../../server/models').connect(dbconfig.dbUri);

module.exports = () => {
  const issuer = process.env.ISSUER || 'https://cosmaze-idp.cosmaze.org:3443';
  const expressApp = express();
  dotenv.load();
  const oidc = new Provider(issuer, config);
  oidc.initialize({
    // adapter: process.env.MONGODB_URI ? require('./adapters/mongodb') : undefined,// eslint-disable-line global-require
    clients,
    keystore,
  }).then(() => {
    oidc.proxy = true;
    // oidc.keys = process.env.SECURE_KEY.split(',');
  }).then(() => {
    expressApp.set('trust proxy', true);
    expressApp.set('view engine', 'ejs');
    expressApp.set('views', path.resolve(__dirname, 'views'));
    // expressApp.use(cors());       // ONly allow if you want to suport CORS feature

    //Host  client application as static with a base url.
    expressApp.use('/authn', express.static(path.join(__dirname, '../../server/static/')));
    expressApp.use('/authn', express.static(path.join(__dirname, '../../client-views/dist')));

    // pass the passport middleware
    expressApp.use(passport.initialize());
    // load passport strategies
    const localSignupStrategy = require('../../server/passport/local-signup');
    const localLoginStrategy = require('../../server/passport/local-login');
    passport.use('local-signup', localSignupStrategy);
    passport.use('local-login', localLoginStrategy);

    // pass the authenticaion checker middleware
    const authCheckMiddleware = require('../../server/middleware/auth-check');
    expressApp.use('/api', authCheckMiddleware);

    expressApp.use(bodyParser.urlencoded({ extended: false }));
    expressApp.use(bodyParser.json());

    expressApp.use('/', interactionapis(oidc));
    expressApp.use('/msgapi', msgapis);
    expressApp.use('/saml', samlapis);

    //Test dynamic  react view - 
    expressApp.use('/viewApis', viewApis);

    // routes
    const authRoutes = require('../../server/routes/auth');
    const apiRoutes = require('../../server/routes/api');
    expressApp.use('/auth', authRoutes);
    expressApp.use('/api', apiRoutes);

    //Redirect all client routes with base base url 
    expressApp.get('/authn/*', function (request, response) {
      response.sendFile(path.resolve(__dirname, '../../server/static/', 'index.html'));
    });

    // leave the rest of the requests to be handled by oidc-provider, there's a catch all 404 there
    expressApp.use(oidc.callback);
  });
  return expressApp;
};
