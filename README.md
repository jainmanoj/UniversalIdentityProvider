# UniversalIdentityProvider 

**Overview**
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
