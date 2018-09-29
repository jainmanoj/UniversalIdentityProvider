const LDAPAuthProvider = require('./ldapAuthProvider');
const asyncSample = require('./AsyncSample');

// LDAP Server Information (read-only access):
// Server: ldap.forumsys.com
// Port: 389
// Bind DN: cn=read-only-admin,dc=example,dc=com
// Bind Password: password
// All user passwords are password.
// You may also bind to individual Users (uid) or the two Groups (ou) that include:
// ou=mathematicians,dc=example,dc=com

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

console.log('ldapAuthProvider : Test Start');

const ldapAuthProvider = new LDAPAuthProvider(LDAPConf.testlocal);

// const bindResUser = ldapAuthProvider.bindByDNorUPN(
//   LDAPConf.testlocal.binddn, LDAPConf.testlocal.password
// ).then((bindByUPN) => {
// //   console.log(bindByUPN);
// });
// // Search Base: dc=example,dc=com  -  Filter: (objectClass=person)

// const opts = {
//   filter: '(objectClass=person)',
//   scope: 'sub',
//   attributes: ['cn', 'sn'],
// };
// ldapAuthProvider.searchbaseWithFilter(LDAPConf.testlocal.basedn, opts)
//   .then((searchResults) => {
//     console.log(searchResults);
//   });

const userId = 'euler';
const userAttributes = ldapAuthProvider.authenticateandgetAttributes(userId, 'password')
  .then((searchResults) => {
    console.log(searchResults);
  });
// console.log(`MANOJ   ${userAttributes}`);

// console.log(`ldapAuthProvider : ${bindResRoot} ${bindResUser} ${ldapAuthProvider} Test end`);

// asyncSample.main();
