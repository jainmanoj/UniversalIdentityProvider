
const fs = require('fs');

const xmldom = require('xmldom');
const xpath = require('xpath');
const saml = require('@socialtables/saml-protocol');
const responseValidation = require('@socialtables/saml-protocol/lib/response-validation');
const protocolbindings = require('@socialtables/saml-protocol/lib/protocol-bindings');
// const signer = require('@socialtables/saml-protocol/lib/util/signed-xml');
const SignedXml = require('xml-crypto').SignedXml;
const pemFormatting = require('@socialtables/saml-protocol/lib/util/pem-formatting');

const ServiceProviderModel = require('./samlServiceProviderModelAdapter.js');
const { idpConfig, spConfig } = require('./samlConfiguration');
const samlMetadata = require('./samlMetadata');

// const credentials        = require('@socialtables/saml-protocol/lib/util/credentials');
// const encryption         = require('@socialtables/saml-protocol/lib/util/encryption');
const DOMParser = xmldom.DOMParser;

const ResponseValidator = responseValidation.ResponseValidator;

const samlConfiguration = { idpConfig, spConfig };

function samlResponseValidation() {
  const model = new ServiceProviderModel(samlConfiguration);
  const sp = new saml.ServiceProvider(spConfig, model);
  const idp = idpConfig;
  const samlResponseEncoded = fs.readFileSync('example/CERT/SAMLResponse.xml', 'utf8');
  const postParams = { SAMLResponse: samlResponseEncoded };

  const samlResponseDecoded = protocolbindings.getDataFromPostBinding(postParams);
  // console.log(`samlResponseDecoded :${JSON.stringify(samlResponseDecoded, null, 4)}`);

  const doc = new DOMParser().parseFromString(samlResponseDecoded.payload);

  const validator = new ResponseValidator(sp, idp, model);
  validator.validateAllSignatures(samlResponseDecoded.payload, doc);
}

function samlResponseValidation() {
  const idpMetadata = fs.readFileSync('example/CERT/idp-metadata.xml', 'utf8');
  samlMetadata.getIDPFromMetadata(idpMetadata);
}

samlResponseValidation();

// const data = 'ManojSignerTest';
// const signingPubKey = fs.readFileSync('example/CERT/sp-cert.pem', 'utf8');
// const certPemWitHeaders = pemFormatting.addPEMHeaders('CERTIFICATE', signingPubKey);
// const signingPvtKey = fs.readFileSync('example/CERT/sp-key.pem', 'utf8');
// const privateKeyPemWithHeaders = pemFormatting.addPEMHeaders('RSA PRIVATE KEY', signingPvtKey);
// const signer = SignedXml.prototype.findSignatureAlgorithm('http://www.w3.org/2001/04/xmldsig-more#rsa-sha256');
// const signeData = signer.getSignature(data, certPemWitHeaders);
// const isVerified = signer.verifySignature(data, privateKeyPemWithHeaders, signeData);
// console.log(`signer :${isVerified}`);

// console.log('SAMLAuthProvider : Test Start');
// samlResponseValidation();
// console.log('SAMLAuthProvider : Test End');
