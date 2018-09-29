// const assert = require('assert');

// const _ = require('lodash');
const ldapjs = require('ldapjs');
// const logger = require('winston');

class LDAPAuthProvider {
  constructor(ldapConfiguration) {
    const ldapOptions = {
      url: ldapConfiguration.url,
      reconnect: true,
      idleTimeout: ldapConfiguration.idleTimeout,
      timeout: ldapConfiguration.timeout,
      connectTimeout: ldapConfiguration.connectTimeout,
      tlsOptions: { rejectUnauthorized: false },
    };
    this.ldapClient = ldapjs.createClient(ldapOptions);
    this.basedn = ldapConfiguration.basedn;
    this.binddn = ldapConfiguration.binddn;
  }

  bindByDNorUPN(dn, password) {
    return new Promise((resolve, reject) => {
      this.ldapClient.bind(dn, password, (err, res) => {
        if (err) {
          return reject(err);
        }
        this.ldapClient.unbind();
        return resolve(res);
      });
    });
  }

  searchbaseWithFilter(searchBase, filter) {
    return new Promise((resolve, reject) => {
      this.ldapClient.search(searchBase, filter, (err, res) => {
        if (err) return reject(err);
        const entries = [];
        res.on('searchEntry', (entry) => {
          const r = entry.object;
          entries.push(r);
        });
        res.on('error', (error) => {
          reject(error);
        });
        res.on('end', (result) => {
          // console.log(result);
          resolve(entries);
        });
      });
    });
  }

  // (&(objectClass=groupOfUniqueNames)(uniqueMember=uid=training,dc=example,dc=com))
  // {
  //     email: 'foo@example.com',
  //     email_verified: true,
  //     address: {
  //       country: '000',
  //       formatted: '000',
  //       locality: '000',
  //       postal_code: '000',
  //       region: '000',
  //       street_address: '000',
  //     },
  //     birthdate: '1987-10-16',
  //     family_name: 'Doe',
  //     gender: 'male',
  //     given_name: 'John',
  //     locale: 'en-US',
  //     middle_name: 'Middle',
  //     name: 'FOO John Doe',
  //     nickname: 'FOO Johny',
  //     phone_number: '+49 000 000000',
  //     phone_number_verified: false,
  //     picture: 'http://lorempixel.com/400/200/',
  //     preferred_username: 'Jdawg',
  //     profile: 'https://johnswebsite.com',
  //     updated_at: 1454704946,
  //     website: 'http://example.com',
  //     zoneinfo: 'Europe/Berlin',
  //   }
  async authenticateandgetAttributes(userId, password) {
    // uid=euler, dc=example,dc=com
    const userDN = `uid=${userId},${this.basedn}`;
    const userAttributesOpts = {
      filter: '(objectClass=person)',
      scope: 'sub',
      attributes: ['uid', 'cn', 'sn', 'mail'],
    };
    await this.bindByDNorUPN(userDN, password);
    const userAttributes = await this.searchbaseWithFilter(userDN, userAttributesOpts);

    const groupDN = this.basedn;
    const userGroupsOpts = {
      filter: `(&(objectClass=groupOfUniqueNames)(uniqueMember=${userDN}))`,
      scope: 'sub',
      attributes: ['cn'],
    };

    const userGroups = await this.searchbaseWithFilter(groupDN, userGroupsOpts);

    const userDetails = {
      email: userAttributes[0].mail,
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
      given_name: userAttributes[0].sn,
      locale: '',
      middle_name: '',
      name: userAttributes[0].cn,
      nickname: '',
      phone_number: '',
      phone_number_verified: false,
      picture: '',
      preferred_username: userAttributes[0].uid,
      profile: '',
      updated_at: 1454704946,
      website: '',
      zoneinfo: '',
      memberOf: userGroups.map(group => group.cn),
    };
    // objArray.map(a => a.foo);

    // console.log(searchResults);
    return { userDetails };
  }
}

module.exports = LDAPAuthProvider;
