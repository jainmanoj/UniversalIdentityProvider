// const CircularJSON = require('circular-json');
const metadata = require('@socialtables/saml-protocol/lib/metadata');
const randomID = require('@socialtables/saml-protocol/lib/util/random-id');

const { idpConfig, spConfig } = require('./samlConfiguration');
const SAMLAuthProvider = require('./samlAuthProvider');

const samlConfiguration = { idpConfig, spConfig };

const renderEngine = require('../../reactviewctrl/renderEngine');

function buildRelayStateParam(resourceId, refresh, nonce, callbackUrl,relayOptions) {
  let relayStateParam = '';
  if (refresh) {
    relayStateParam = `${resourceId}~#~refresh=true~#~${nonce}`;
  } else {
    relayStateParam = `${resourceId}~#~refresh=false~#~${nonce}`;
  }
  if (callbackUrl) {
    relayStateParam = `${relayStateParam}~#~callbackUrl=${callbackUrl}`;
  } else {
    relayStateParam = `${relayStateParam}~#~callbackUrl=''`;
  }
  if (relayOptions){
    relayStateParam = `${relayStateParam}~#~options=${relayOptions.chainedAuthScheme}`;
  } else {
    relayStateParam = `${relayStateParam}~#~options=''`;
  }
  return relayStateParam;
}

function parseRelayStateParam(relayState) {
  const relayStateParams = relayState.split('~#~');
  return {
    resourceId: relayStateParams[0],
    isRefresh: relayStateParams[1].split('refresh=')[1],
    nonce: relayStateParams[2],
    callbackUrl: relayStateParams[3].split('callbackUrl=')[1],
    options: relayStateParams[4].split('options=')[1],
  };
}

exports.buildSAMLAuthRequest = async (callbackUrl, relayOptions) => {
  const samlAuthProvider = new SAMLAuthProvider(samlConfiguration);
  const authNRequest = await samlAuthProvider.samlLogin();
  samlAuthProvider.setCallbackUrl(callbackUrl);

  const samlAuthNRequest = authNRequest.formBody.SAMLRequest;
  const idpSSOurl = authNRequest.url.href;
  const nonce = randomID();

  const relayStateParam = buildRelayStateParam('testId', false, nonce, callbackUrl, relayOptions);

  const samlRequestPayload = {
    response: {
      idpSSOurl: idpSSOurl,
      samlAuthNRequest: samlAuthNRequest,
      relayStateParam: relayStateParam
    }
  };

  return samlRequestPayload;

}

// GET /saml/login?callbackUrl=/interaction/701265d8-3b39-4ccd-9f43-a02d46137fb5/saml
exports.samlLoginCtrl = async (req, res) => {
  // console.log('SAMLAuthProvider : samlLoginCtrl Start');
  const callbackUrl = req.query.callbackUrl;
  const samlAuthProvider = new SAMLAuthProvider(samlConfiguration);
  samlAuthProvider.setCallbackUrl(callbackUrl);
  const authNRequest = await samlAuthProvider.samlLogin();
  const samlAuthNRequest = authNRequest.formBody.SAMLRequest;
  const idpSSOurl = authNRequest.url.href;
  const nonce = randomID();
  const relayStateParam = buildRelayStateParam('testId', false, nonce, callbackUrl);

  // const view = 'samlRequest';
  // res.render(view, { idpSSOurl, relayStateParam, samlAuthNRequest });

  //React SSR Views
  const view = 'SAMLREQUEST';
  const params = {
    idpSSOurl: idpSSOurl,
    samlAuthNRequest: samlAuthNRequest,
    relayStateParam: relayStateParam
  };
  const viewStr = renderEngine.renderView(view, params);
  res.send(viewStr);

};



// GET /saml/metadata
exports.getSAMLSPMetaData = async (req, res) => {
  // console.log('SAMLAuthProvider : Test Start');
  res.type('application/xml');
  const serviceProvider = samlConfiguration.spConfig;
  const encoded = await metadata.buildSPMetadata(serviceProvider);
  res.status(200).send(encoded);
};


// Post /saml/assertion
exports.samlAssertion = async (req, res) => {
  const samlAuthProvider = new SAMLAuthProvider(samlConfiguration);
  // console.log(`\n samlAssertion encoded ${JSON.stringify(req.body)}`);
  // const samlResponse = req.body.SAMLResponse;
  //RelayState: testId~#~refresh=false~#~_0fe9fa1b388d2183e7e999b461b64f46556779deac~#~callbackUrl=/interaction/701265d8-3b39-4ccd-9f43-a02d46137fb5/saml~#~options=OTP
 
  const relayStateParams = parseRelayStateParam(req.body.RelayState);
  const callbackUrl = relayStateParams.callbackUrl;
  const options = relayStateParams.options;

  const userDetails = await samlAuthProvider.consumeAssertion(req.body, relayStateParams.nonce);
  const userDetailsJson = JSON.stringify(userDetails);

  // const view = 'samlAssertion';
  // res.render(view, { callbackUrl, options, userDetailsJson });

  //React SSR Views
  const view = 'SAMLASSERTION';
  const params = {
    callbackUrl: callbackUrl,
    options: options,
    userDetails: userDetailsJson
  };
  const viewStr = renderEngine.renderView(view, params);
  res.send(viewStr);
};
