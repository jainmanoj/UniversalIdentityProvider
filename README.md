# UniversalIdentityProvider 

**Overview** <br><br>
1)Multi-strategy based authentication and authorization  middleware.
  Following stratgy are supported
  - Local Directory   (Local DB)
  - Active Directory / LDAP 
  - SAML  IDP
  - Social login (Google ….)

2) Multifactor authentication
  - OTP
  - OTP + Speech (Limited support)
  - OTP + Speech + Video (Not supported)
3) Build around OpenID Connect to delegate authentication to external Identity provider
4) First factor authentication is done by external IDP provider
5) Based on risk profile (Computed by AI based risk scoring engine) – User is prompted for higher level authentication.


**Features -**
  - Multi-strategy based IAM  middleware with pluggable authentication strategy
  - Unified Attribute Based Policy Model – Intent based access policy – (NLP in pipeline for intent modeling)
  - OAuth with JWT  bearer tokens
  - Stateless authentication service (Suitable for all type of applications)
  - Independent service (Standalone or Containerized or Cloud)

**Architecture**
[![Alt Architecture of UniversalIdentityProvider](https://github.com/jainmanoj/UniversalIdentityProvider/blob/master/docs/Architecture.jpg "UniversalIdentityProvider Architecture")

**Online demo**
[![Alt Online demo of UniversalIdentityProvider](https://img.youtube.com/vi/oWxnyeNrh_Y/0.jpg)](https://www.youtube.com/watch?v=oWxnyeNrh_Y)


**Getting started**<br>

1. npm run bundle:dev  - this will create webpack bundle of react views and mounted on client-views/dist/js/app.js
2. You can lauch the application with npm start
3. you can also debug the application - launch with vscode debug mode.

to open
https://localhost:6443

setup the client use basic mode
Then login - it will redirect you to openid react login view.
Select the scheme you want to login provide details
On successfull login it will open otp page and consent page
Finally it will redirect to user page

LDAP and SAML is installed on externally


MORE to do -
1. Modify the client views with React and make it good looking
2. Create an app which can be deployed in cloud and use for User registration and login
3. Voice authentication / Face Authentication etc... new Authschemes to add
3. Block chain integration -????
