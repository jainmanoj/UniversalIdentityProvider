const xpath = require('xpath');
const xmldom = require('xmldom');
const encryption = require('@socialtables/saml-protocol/lib/util/encryption');
const pemFormatting = require('@socialtables/saml-protocol/lib/util/pem-formatting');
const errors = require('@socialtables/saml-protocol/lib/errors');
const protocol = require('@socialtables/saml-protocol/lib/protocol');
const namespaces = require('@socialtables/saml-protocol/lib/namespaces');

const DOMParser = xmldom.DOMParser;
const select = xpath.useNamespaces(namespaces);

// THIS is patch for IDP Metadata reader
// The IDP Certs are not parsed correctly in @socialtables/saml-protocol
// This is just a patch in base module
// I am not able to extend the base function, so it almost a copy


function getCredentialsFromRoleDescriptor(roleDescriptor) {
  const result = {
    credentials: [],
  };

  // invert encryption algorithm support map to categorize listed
  // encryption algorithms
  const encAlgorithmMap = Object
    .keys(encryption.supportedAlgorithms)
    .reduce((encAlgMap, algType) => {
      encryption.supportedAlgorithms[algType].forEach((algURI) => {
        encAlgMap[algURI] = algType;
      });
      return encAlgMap;
    }, {});

  const keyDescriptors = select('md:KeyDescriptor', roleDescriptor);
  let i = 0;
  keyDescriptors.forEach((keyDescriptor) => {
    // console.log("keyDescriptors\n "+ new xmldom.XMLSerializer().serializeToString(keyDescriptor));
    // read the essential bits
    const x509Cert = select('//ds:X509Certificate/text()', keyDescriptor)[i++];
    // console.log("\nx509Cert "+ new xmldom.XMLSerializer().serializeToString(x509Cert));

    // X509 certificates are typically formatted as columns, and are likely
    // to be indented when dumped into XML as text. As such, we clobber
    // all whitespace in the blob before adding PEM headers.
    const formattedCert = pemFormatting.addPEMHeaders('certificate', x509Cert.nodeValue.replace(/[\t\s\n\r]/g, ''));
    // console.log("\nkeyDescriptors formattedCert "+ formattedCert);
    const use = keyDescriptor.getAttribute('use');
    if (x509Cert) {
      const credential = { certificate: formattedCert };
      if (use) {
        credential.use = use;
      }
      result.credentials.push(credential);
    }

    // read encryption methods
    const encryptionMethods = select('md:EncryptionMethod', keyDescriptor);
    encryptionMethods.forEach((encMethod) => {
      const algURI = encMethod.getAttribute('Algorithm');
      const algCategory = encAlgorithmMap[algURI];
      if (algCategory) {
        if (!result.algorithms) {
          result.algorithms = {};
        }
        if (!result.algorithms[algCategory]) {
          result.algorithms[algCategory] = [];
        }
        if (result.algorithms[algCategory].indexOf(algURI) < 0) {
          result.algorithms[algCategory].push(algURI);
        }
      }
    });
    // console.log("\nResult after iteration  "+ JSON.stringify(result,null,4));
  });

  return result;
}

function getIDPFromMetadata(metadataXML) {
  const doc = new DOMParser().parseFromString(metadataXML);

  const entityDescriptor = select('//md:EntityDescriptor', doc)[0];
  const idpDescriptor = select('//md:IDPSSODescriptor', doc)[0];

  if (!idpDescriptor || !entityDescriptor) {
    throw new errors.ValidationError('No identity provider defined in metadata');
  }

  // base config attributes from root node
  const idp = {
    entityID: entityDescriptor.getAttribute('entityID'),
    endpoints: {},
  };

    // assign credentials, encryption algorithms
  Object.assign(idp, getCredentialsFromRoleDescriptor(idpDescriptor));

  // read endpoint bindings
  const ssoLoginBindings = select('//md:SingleSignOnService', idpDescriptor);
  const ssoLogoutBindings = select('//md:SingleLogoutService', idpDescriptor);

  // internal reverse map of protocol bindings
  const bindingKeyMap = Object.keys(protocol.BINDINGS).reduce((map, key) => {
    map[protocol.BINDINGS[key]] = key.toLowerCase();
    return map;
  }, {});

  ssoLoginBindings.forEach((loginBinding) => {
    const location = loginBinding.getAttribute('Location');
    const bindingURI = loginBinding.getAttribute('Binding');
    if (bindingURI in bindingKeyMap) {
      const bindingKey = bindingKeyMap[bindingURI];
      idp.endpoints.login = idp.endpoints.login || {};
      idp.endpoints.login[bindingKey] = location;
      if (loginBinding.getAttribute('isDefault')) {
        idp.endpoints.login._default = bindingKey;
      }
    }
  });

  ssoLogoutBindings.forEach((logoutBinding) => {
    const location = logoutBinding.getAttribute('Location');
    const bindingURI = logoutBinding.getAttribute('Binding');
    if (bindingURI in bindingKeyMap) {
      const bindingKey = bindingKeyMap[bindingURI];
      idp.endpoints.logout = idp.endpoints.logout || {};
      idp.endpoints.logout[bindingKey] = location;
      if (logoutBinding.getAttribute('isDefault')) {
        idp.endpoints.logout._default = bindingKey;
      }
    }
  });

  // read name ID formats
  const nameIDFormats = select('//md:NameIDFormat/text()', idpDescriptor);
  if (nameIDFormats.length) {
    idp.nameIDFormats = nameIDFormats.map(nameIDFormat => nameIDFormat.nodeValue);
  }

  // add signing requirement flag if specified
  if (idpDescriptor.getAttribute('WantAuthnRequestsSigned') == true) {
    idp.requireSignedRequests = true;
  }

  return idp;
}


module.exports = { getIDPFromMetadata };
