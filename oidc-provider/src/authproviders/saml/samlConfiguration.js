const fs = require('fs');

// const metadata = require('@socialtables/saml-protocol/lib/metadata');
const samlMetadata = require('./samlMetadata');

const spConfig = {
  entityID: 'cosmaze-sp.cosmaze.org',
  credentials: [
    {
      certificate: fs.readFileSync('CERT/sp-cert.pem', 'utf8'),
      privateKey: fs.readFileSync('CERT/sp-key.pem', 'utf8'),
    },
  ],
  endpoints: {
    assert: 'https://cosmaze-idp.cosmaze.org:3443/saml/assertion',
  },
  signAllRequests: true,
  requireSignedResponses: true,
  extendedRequirements: {
    InResponseTo: true,
    NotOnOrAfter: true,
    Recipient: true,
  },
};
function parseIdpMetadata() {
  const idpMetadataXmlStr = fs.readFileSync('CERT/idp-metadata.xml', 'utf8');
  const idp = samlMetadata.getIDPFromMetadata(idpMetadataXmlStr);
  // console.log(`parseIdpMetadata : ${JSON.stringify(idp, null, 4)}`);
  return idp;
}

// const idpConfig = async () => {
//   const result = await parseIdpMetadata();
//   return result;
// };

const idpConfig = parseIdpMetadata();

// const idpConfig = {
//   entityID: 'https://idprovider.cosmaze.org/idp/shibboleth',
//   credentials: [
//     {
//       // certificate: fs.readFileSync('../../../../CERT/idp-cert.pem', 'utf8'),
//       certificate: 'MIIDQzCCAiugAwIBAgIUfrqUPFRYINxdi7HSNXL0rmDGwW8wDQYJKoZIhvcNAQELBQAwITEfMB0GA1UEAwwWaWRwcm92aWRlci5jb3NtYXplLm9yZzAeFw0xODA4MTMxMjA5MTFaFw0zODA4MTMxMjA5MTFaMCExHzAdBgNVBAMMFmlkcHJvdmlkZXIuY29zbWF6ZS5vcmcwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCFvrV9RGkXSIymD7uQfaBXoF8jsn3jAhdSgijVlw8j0Oz7QK/7Xee+ksQwgzcZefmrfXATynq8V6mEcfVxQwb/R+dN0X8llI6oO6BsbDeped9qbiCe/QXGywHYfdrIZjbiH9+WxsJi0MKXXzY/Ii5YBP4NGghP+UuGy0FyucHAbiV0g7fDWSbJI1/bx1hmEM7VJ8Tk459E9qGR8/lAQhhrY/LsnFBwmntwHd9GoYQn13Y9O4gE1Fq020GfEfipAIxfetpzejnASqhvNRTc2SbDSjXwPJxHgHctLO5V2YE8APlMQf/7tGcEkHPxYWutIfLQYr29DWiY3CUUmKv+T/QNAgMBAAGjczBxMB0GA1UdDgQWBBSiOf79NiEDFk7VagHc/LkbZc1mvzBQBgNVHREESTBHghZpZHByb3ZpZGVyLmNvc21hemUub3Jnhi1odHRwczovL2lkcHJvdmlkZXIuY29zbWF6ZS5vcmcvaWRwL3NoaWJib2xldGgwDQYJKoZIhvcNAQELBQADggEBADmEMX5pp7gPg9kOOT8jFxHnURERSDxHQOcc5QUkvENl+sXXmbzAD5uuxOHbs3F9h3tc5wd0A521qxpj9CTzESvE6EgrmOFWjGn7Mf566+5YoeLXhq2V4pM55YDDv0F8zApFKSaW71Tz8sQhYFJChpvu21dGw3lzZgUbNPhRJ/W6LWicpnpmERXlgye9LkYql14jLD3XSWsffXsDPFEeKblbPlnSLRbAj98sUwpedsubYBLoVmqJm05JVlO77o8hAHYzcUraiSIvJy6l1m0OksNOLKHpn7a9NIVMGBvWoE0v/bpb9gbWTdvupDBcyAs4zPQYuEbJXe7/HNZ5oEd/jzg='
//     },
//   ],
//   endpoints: {
//     login: 'https://idprovider.cosmaze.org/idp/profile/SAML2/POST/SSO',
//     logout: {
//       post: 'https://idprovider.cosmaze.org/idp/profile/SAML2/POST/SLO',
//     },
//   },
//   signAllResponses: false,
//   requireSignedRequests: false,
// };

module.exports = { spConfig, idpConfig };
