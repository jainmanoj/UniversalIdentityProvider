
const fs = require('fs');
const crypto = require('crypto');

const select = require('xml-crypto').xpath;
const Dom = require('xmldom').DOMParser;
const SignedXml = require('xml-crypto').SignedXml;
const FileKeyInfo = require('xml-crypto').FileKeyInfo;

const { spConfig, idpConfig } = require('./samlConfiguration');

function signXml(xml, xpath, key, dest) {
  const sig = new SignedXml();
  sig.signingKey = fs.readFileSync(key);
  sig.addReference(xpath);
  sig.computeSignature(xml);
  fs.writeFileSync(dest, sig.getSignedXml());
}

function validateXml(xml, key) {
  const doc = new Dom().parseFromString(xml);
  const signature = select(doc, "/*/*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0];
  const sig = new SignedXml();
  sig.keyInfoProvider = new FileKeyInfo(key);
  sig.loadSignature(signature.toString());
  const res = sig.checkSignature(xml);
  if (!res) console.log(sig.validationErrors);
  return res;
}

function testXMLSignANdVerify() {
  const xml = '<library>'
            + '<book>'
              + '<name>Harry Potter</name>'
            + '</book>'
          + '</library>';

  // sign an xml document
  signXml(xml,
    "//*[local-name(.)='book']",
    // "example/CERT/client.pem",
    'example/CERT/sp-key.pem',
    'result.xml');

  console.log('xml signed succesfully');

  const signedXml = fs.readFileSync('result.xml').toString();
  console.log('validating signature...');
  if (validateXml(signedXml, 'example/CERT/sp-cert.pem')) {
    console.log('signature is valid');
  } else {
    console.log('signature not valid');
  }
}

function createSignature(signedInfo, signingKey) {
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signedInfo);
  const res = signer.sign(signingKey, 'base64');
  console.log(`createSignature :${res}`);
  return res;
}

function verifySignature(str, key, signatureValue) {
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(str);
  const res = verifier.verify(key, signatureValue, 'base64');
  return res;
}

function testSamlverifySignature() {
  const str = fs.readFileSync('example/CERT/credentials/testStr.data', 'utf8');
  // const pubKey = fs.readFileSync('example/CERT/credentials/idp-signing.crt', 'utf8');
  const pvtKey = fs.readFileSync('example/CERT/credentials/idp-signing.key', 'utf8');
  const pubKey = idpConfig.credentials[1].certificate;

  const signatureValue = createSignature(str, pvtKey);
  // const key = idpConfig.credentials[0].certificate;
  // const signatureValue = 'Lvq2kjkL1idhIbajlwXg81aGRxVlXq1ofaDJijfEBsciF6ILsEvlTK3Q+of4FxL8R2rX/9MTI1bx3NdShvPSxx1F/hbJGpkLv3yxdgucTc8KUySiIk8eQ3pfzZG3CPUhfbcXyLWTBY9r2iKq3pri3AJyg1y6lUCBAcQaNIpPnQQvDCbPCY+HtyReYXQ68Rs8uBjrjftnivUPxAbeEduu8aFVfQW6gRUV5ki2KLP48OHopf9391uQK17QDx4vDe7fccFj7wuCz8UpatglYZvTdQM4WrGRyQZwI/rz5OIIo7K7lLZA3YKMfxGbKFkw+8xVIXwsTWw206FHcNpmh7V9eQ==';
  const res = verifySignature(str, pubKey, signatureValue);
  console.log(`testSamlverifySignature ${res}`);
}

testXMLSignANdVerify();
testSamlverifySignature();
