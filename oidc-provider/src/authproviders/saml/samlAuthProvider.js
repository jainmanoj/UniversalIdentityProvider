const saml = require('@socialtables/saml-protocol');

const ServiceProviderModel = require('./samlServiceProviderModelAdapter.js');


class SAMLAuthProvider {
  constructor(samlConfiguration) {
    this.spCfg = samlConfiguration.spConfig;
    this.idpCfg = samlConfiguration.idpConfig;
    this.spModel = new ServiceProviderModel(samlConfiguration);
    this.serviceProvider = new saml.ServiceProvider(this.spCfg, this.spModel);
  }

  setCallbackUrl(callbackUrl) {
    this.callbackUrl = callbackUrl;
  }

  async samlLogin() {
    const authNRequest = await this.serviceProvider.produceAuthnRequest(this.idpCfg);
    return authNRequest;
  }

  // async consumeAssertion(samlResponse, nonce, isEcp) {
  async consumeAssertion(samlResponse) {
    const assertResponse = await this.serviceProvider.consumePostResponse(samlResponse);
    const userDetails = this.parseAssertion(assertResponse);
    return userDetails;
  }

  parseAssertion(samlAssertion) {
    const userDetails = {
      email: 'userAttributes[0].mail',
      email_verified: true,
      address: {
        country: '',
        formatted: '',
        locality: '',
        postal_code: '',
        region: '',
        street_address: '',
      },
      birthdate: '',
      family_name: '',
      gender: '',
      given_name: 'userAttributes[0].sn',
      locale: '',
      middle_name: '',
      name: 'userAttributes[0].cn',
      nickname: '',
      phone_number: '',
      phone_number_verified: false,
      picture: '',
      preferred_username: 'userAttributes[0].uid',
      profile: '',
      updated_at: 1454704946,
      website: '',
      zoneinfo: '',
      memberOf: '',
    };
    if (samlAssertion) {
      if (samlAssertion.nameID && samlAssertion.nameIDFormat) {
        userDetails.name = samlAssertion.nameID;
      }
      if (samlAssertion.attributes && samlAssertion.attributes.length > 0) {
        samlAssertion.attributes.forEach((attribute) => {
          switch (attribute.name.toString()) {
            case 'urn:oid:0.9.2342.19200300.100.1.1': {
              userDetails.preferred_username = attribute.values[0];
              break;
            }
            case 'urn:oid:2.16.840.1.113730.3.1.3': {
              userDetails.email = attribute.values[0];
              break;
            }
            case 'urn:oid:2.5.4.4': {
              userDetails.given_name = attribute.values[0];
              userDetails.name = attribute.values[0];
              break;
            }
            default: {
              // logger.info('unknown attribute found ::' + attribute.name);
              break;
            }
          }
        }, this);
      }
    }
    return userDetails;
  }
}


module.exports = SAMLAuthProvider;
