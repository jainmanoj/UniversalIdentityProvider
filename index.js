const fs = require('fs');
const http = require('http');
const https = require('https');

const { Issuer } = require('openid-client');

const {
  // ISSUER = 'https://guarded-cliffs-8635.herokuapp.com',
  ISSUER = 'https://cosmaze-idp.cosmaze.org:3443',
  PPORT = 3000,
  PSECUREPORT = 3443,
  PORT = 6000,
  SECUREPORT = 6443,
} = process.env;

// const providerFactory = require('./provider/src/provider-exp.EJS');
const providerFactory = require('./oidc-provider/src/provider-exp');
// const providerFactory = require('./provider/src/provider-koa');

const privateKey = fs.readFileSync('CERT/cosmaze-idp-app-key-server.pem', 'utf8');
const certificate = fs.readFileSync('CERT/cosmaze-idp-app-cert-server.pem', 'utf8');

//Starting OIDC Provider application
const providerApp = providerFactory();
const credentials = { key: privateKey, cert: certificate };
const httpServer = http.createServer(providerApp);
const httpsServer = https.createServer(credentials, providerApp);
httpServer.listen(PPORT);
httpsServer.listen(PSECUREPORT);

//Starting OIDC Client application
const oidcClientAppFactory = require('./oidc-client-app/oidcClientApp');
Issuer.defaultHttpOptions = { timeout: 5000 };
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
Issuer.discover(ISSUER).then((issuer) => {
  const clientApp = oidcClientAppFactory(issuer);
  http.createServer(clientApp.callback()).listen(PORT);
  https.createServer(credentials, clientApp.callback()).listen(SECUREPORT);
}).catch((err) => {
  console.error(err); // eslint-disable-line no-console
  process.exitCode = 1;
});
