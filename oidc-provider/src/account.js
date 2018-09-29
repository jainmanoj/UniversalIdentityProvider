const assert = require('assert');

const _ = require('lodash');
const uuid = require('uuid/v4');

const LDAPAuthProvider = require('./authproviders/ldap/ldapAuthProvider.js');

const USERS = {
  '23121d3c-84df-44ac-b458-3d63a9a05497': {
    email: 'foo@example.com',
    email_verified: true,
    address: {
      country: '000',
      formatted: '000',
      locality: '000',
      postal_code: '000',
      region: '000',
      street_address: '000',
    },
    birthdate: '1987-10-16',
    family_name: 'Doe',
    gender: 'male',
    given_name: 'John',
    locale: 'en-US',
    middle_name: 'Middle',
    name: 'FOO John Doe',
    nickname: 'FOO Johny',
    phone_number: '+49 000 000000',
    phone_number_verified: false,
    picture: 'http://lorempixel.com/400/200/',
    preferred_username: 'Jdawg',
    profile: 'https://johnswebsite.com',
    updated_at: 1454704946,
    website: 'http://example.com',
    zoneinfo: 'Europe/Berlin',
    memberOf: ['Test'],
  },
  'c2ac2b4a-2262-4e2f-847a-a40dd3c4dcd5': {
    email: 'bar@example.com',
    email_verified: false,
    address: {
      country: '000',
      formatted: '000',
      locality: '000',
      postal_code: '000',
      region: '000',
      street_address: '000',
    },
    birthdate: '1987-10-16',
    family_name: 'Doe',
    gender: 'male',
    given_name: 'John',
    locale: 'en-US',
    middle_name: 'Middle',
    name: 'BAR John Doe',
    nickname: 'BAR Johny',
    phone_number: '+49 000 000000',
    phone_number_verified: false,
    picture: 'http://lorempixel.com/400/200/',
    preferred_username: 'Jdawg',
    profile: 'https://johnswebsite.com',
    updated_at: 1454704946,
    website: 'http://example.com',
    zoneinfo: 'Europe/Berlin',
    memberOf: ['Test'],

  },
};

const LDAPConf = {
  testlocal: {
    url: 'ldap://ldap.forumsys.com:389',
    userPrincipalName: 'read-only-admin@example.com',
    binddn: 'cn=read-only-admin,dc=example,dc=com',
    password: 'password',
    basedn: 'dc=example,dc=com',
    reconnect: true,
    idleTimeout: 40000,
    timeout: 40000,
    connectTimeout: 40000,
    tlsOptions: { rejectUnauthorized: false },
  },
  testremote: {
    url: 'idprovider.cosmaze.org',
    userPrincipalName: 'admin@cosmaze.org',
    password: 'colors321',
    basedn: 'cosmaze.org',
    reconnect: true,
    idleTimeout: 40000,
    timeout: 40000,
    connectTimeout: 40000,
    tlsOptions: { rejectUnauthorized: false },
  },
};


class Account {
  constructor(id) {
    this.accountId = id; // the property named accountId is important to oidc-provider
  }

  // claims() should return or resolve with an object with claims that are mapped 1:1 to
  // what your OP supports, oidc-provider will cherry-pick the requested ones automatically
  claims() {
    return Object.assign({}, USERS[this.accountId], {
      sub: this.accountId,
    });
  }

  static async findById(ctx, id) {
    // this is usually a db lookup, so let's just wrap the thing in a promise, oidc-provider expects
    // one
    return new Account(id);
  }

  static async authenticateWithSaml(userDetails) {
    const id = uuid();
    // USERS[id] = Object.values(userDetails)[0];;
    const userDetailsObj = JSON.parse(userDetails);
    USERS[id] = Object.assign({}, userDetailsObj);
    return new this(id);
  }


  static async authenticateWithScheme(userId, password, scheme) {

    if (scheme === 'Local') {
      console.log(`Authention with scheme ${scheme}`);
      return this.authenticate(userId, password);
    }
    if (scheme === 'LDAP') {
      console.log(`Authention with scheme ${scheme}`);
      const ldapAuthProvider = new LDAPAuthProvider(LDAPConf.testlocal);
      const userDetails = await ldapAuthProvider.authenticateandgetAttributes(userId, password);
      const id = uuid();
      // USERS[id] = Object.values(userDetails)[0];;
      USERS[id] = Object.assign({}, Object.values(userDetails)[0]);
      return new this(id);
    } else {
      console.log(`Authention with default scheme ${scheme}`);
      return this.authenticate(userId, password);
    }
  }

  static async authenticate(email, password) {
    assert(password, 'password must be provided');
    assert(email, 'email must be provided');
    const lowercased = String(email).toLowerCase();
    const id = _.findKey(USERS, { email: lowercased });
    assert(id, 'invalid credentials provided');

    // this is usually a db lookup, so let's just wrap the thing in a promise
    return new this(id);
  }
}

module.exports = Account;
