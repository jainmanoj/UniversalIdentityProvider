
const express = require('express');
const bodyParser = require('body-parser');
const Account = require('../account');

const router = express.Router();
const parse = bodyParser.urlencoded({ extended: false });
const SAMLController = require('../authproviders/saml/samlController.js');
const renderEngine = require('../reactviewctrl/renderEngine');

module.exports = (oidc) => {
  router.get('/interaction/:grant', async (req, res) => {
    oidc.interactionDetails(req).then((details) => {
      // console.log('see what else is available to you for interaction views', details);
      const view = (() => {
        switch (details.interaction.reason) {
          case 'consent_prompt':
            return 'consent';
          case 'client_not_authorized':
            return 'interaction';
          default:
            return 'login';
        }
      })();

      if (view === 'login') {
        res.redirect(`/authn/authlogin/${details.uuid}`);   ///authn/authlogin/:uuid)
        //  res.render(view, { details });
      } else {
        res.render(view, { details });
      }
    });
  });

  router.get('/interaction/:grant/consent', parse, (req, res) => {
    // console.log('see what else is available to you for Consent views');
    oidc.interactionDetails(req).then((details) => {
      const view = 'consent';
      res.render(view, { details });
    });
  });

  function buildconsent(consent) {
    const consentObj = JSON.parse(consent);
    let consentStr = '';
    Object.keys(consentObj).forEach((key) => {
      consentStr += `${key} `;
    });
    // console.log(`consentStr :   ${consentStr}`);
    return consentStr;
  }

  function validateOTP(otp) {
    if (otp === '123456') {
      return true;
    }
    return false;
  }

  router.post('/interaction/:grant/consent', parse, (req, res) => {
    oidc.interactionFinished(req, res, {
      login: {
        account: req.body.accountId,
        acr: '1',
        remember: !!req.body.remember,
        ts: Math.floor(Date.now() / 1000),
      },
      consent: {
        // scope: 'openid email phone',
        scope: buildconsent(req.body.consent),
      },
    });
    // consent: {"openid":true,"profile":true,"address":true,"phone":true}
    // TODO: remove offline_access from scopes if remember is not checked
  });

  router.post('/interaction/:grant/login/chain/OTP', parse, (req, res) => {

    const account = {};
    let optEntered = req.body.totp;
    account.accountId = req.body.accountId;
    console.log(`chainedOTP : ${JSON.stringify(req.body,null,4)} ${optEntered}  ${account.accountId}`);
    
    if (validateOTP(optEntered)) {
      oidc.interactionDetails(req).then((details) => {
            // const view = 'consent';
            // res.render(view, { account, details });
            // res.header("Access-Control-Allow-Origin", "*");
            // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            console.log(`chainedOTP : ${details}  ${account}  `);

            res.json({
              response: {
                account: account,
                details: details,
                isChained: false,
                chainedAuthScheme : ''
              }
            });
      });
    }

    // consent: {"openid":true,"profile":true,"address":true,"phone":true}
    // TODO: remove offline_access from scopes if remember is not checked
  });

  router.post('/interaction/:grant/confirm', parse, (req, res) => {
    oidc.interactionFinished(req, res, {
      consent: {},
    });
  });

  router.post('/interaction/:grant/saml', parse, (req, res, next) => {
    Account.authenticateWithSaml(req.body.userDetails)
      .then((account) => {
        oidc.interactionDetails(req).then((details) => {
          const options = req.body.options  //Will use options for complex flow execution
          const autheScheme1 = 'SAML';
          const autheScheme2 = options; //options are passed as authschem2
          let isChained = false;
          let chainedAuthScheme = 'NONE';
          if (autheScheme2 && !(autheScheme2 === 'NONE')) {
            isChained = true;
            chainedAuthScheme = autheScheme2;
          }
          console.log(`authenticateWithSAMLScheme : ${autheScheme1}  ${isChained}  ${chainedAuthScheme}`);
          if (isChained && !(chainedAuthScheme === 'NONE')) {
            // const view = 'totp';
            // const scheme = req.body.authscheme2;
            // res.render(view, { account, details, scheme });

            //Rendering react view using SSR
            const view = 'OTP';
            const params = { 
                  account: account,
                  details: details,
                  isChained: isChained,
                  chainedAuthScheme: chainedAuthScheme
            };
            const viewStr = renderEngine.renderView(view, params);
            res.send(viewStr);
          }
          else {
            // const view = 'consent';
            // res.render(view, { account, details });
            // res.header("Access-Control-Allow-Origin", "*");
            // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

            //Rendering react view using SSR
            const view = 'CONSENT';
            const params = { 
                  account: account,
                  details: details,
                  isChained: isChained,
                  chainedAuthScheme: chainedAuthScheme
            };
            const viewStr = renderEngine.renderView(view, params);
            res.send(viewStr);

          }

          });
        }).catch(next);
    });

  

  router.post('/interaction/:grant/login', parse, async (req, res, next) => {
    if (req.body.authscheme1 === 'SAML') {
      const autheScheme1 = req.body.authscheme1;
      const autheScheme2 = req.body.authscheme2;
      let isChained = false;
      const relayOptions = {};
      let chainedAuthScheme = 'NONE';
      if (autheScheme2 && !(autheScheme2 === 'NONE')) {
        isChained = true;
        chainedAuthScheme = autheScheme2;
      }
      relayOptions.isChained = isChained;
      relayOptions.chainedAuthScheme = chainedAuthScheme;

      const grant = req.params.grant;
      const callbackUrl = `/interaction/${grant}/saml`;

      console.log(`authenticateWithScheme : ${autheScheme1}  ${isChained}  ${chainedAuthScheme}`);
      const samlRequestPayload = await SAMLController.buildSAMLAuthRequest(callbackUrl, relayOptions);
      res.json(samlRequestPayload);
      next();
    } else {
      Account.authenticateWithScheme(req.body.email, req.body.password, req.body.authscheme1)
        .then((account) => {
          oidc.interactionDetails(req).then((details) => {
            const autheScheme1 = req.body.authscheme1;
            const autheScheme2 = req.body.authscheme2;
            let isChained = false;
            let chainedAuthScheme = 'NONE';
            if (autheScheme2 && !(autheScheme2 === 'NONE')) {
              isChained = true;
              chainedAuthScheme = autheScheme2;
            }
            console.log(`authenticateWithScheme : ${autheScheme1}  ${isChained}  ${chainedAuthScheme}`);
            if (isChained && !(chainedAuthScheme === 'NONE')) {
              // const view = 'totp';
              // const scheme = req.body.authscheme2;
              // res.render(view, { account, details, scheme });
              res.json({
                response: {
                  account: account,
                  details: details,
                  isChained: isChained,
                  chainedAuthScheme: chainedAuthScheme
                }
              });

            }
            else {
              // const view = 'consent';
              // res.render(view, { account, details });
              // res.header("Access-Control-Allow-Origin", "*");
              // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

              res.json({
                response: {
                  account: account,
                  details: details,
                  isChained: isChained,
                  chainedAuthScheme: chainedAuthScheme
                }
              });
            }
          });
        }).catch(next);
    }

  });



  return router;
}


