import React from 'react';
import PropTypes from 'prop-types';
import Auth from '../modules/Auth';
import AuthnLoginForm from '../components/AuthnLoginForm.jsx';
import ConsentPage from './ConsentPage.jsx';
import OTPPanelPage from './OTPPanelPage.jsx';
import RawHTMLPage from './RawHTMLPage.jsx';
import SAMLRequestPage from './SAMLRequestPage.jsx';

const authSchemePrimary = [
  { key: 'local', name: 'Local' },
  { key: 'ldap', name: 'LDAP' },
  { key: 'certs', name: 'Digital Certificates' },
  { key: 'saml', name: 'SAML' },
  { key: 'blockchain', name: 'Blockchain' }
];

const authSchemeSecondary = [
  { key: 'none', name: 'NONE' },
  { key: 'otp', name: 'OTP' },
  { key: 'rsaecureid', name: 'RSASecureID' },
  { key: 'fingerprint', name: 'Fingerprint' },
  { key: 'voice', name: 'Voice' },
  { key: 'face', name: 'Face' }
];

class AuthnLoginPage extends React.Component {
  /**
   * Class constructor.
   */
  constructor(props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    const { uuid } = this.props.match.params;
    // if(this.props.match.params){
    //  this.uuid = this.props.match.params;
    // } else {
    //   this.uuid = ''
    // }

    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      user: {
        email: '',
        password: '',
        remember: '',
        authscheme1: '',
        authscheme2: ''
      }
    };

    this.uuid = uuid;
    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);

    this.isLoggedIn = false;
    this.isRedirected = false;
    this.loginResp = {};
    this.attributes = {};
    this.isChained = false;
    this.chainedAuthScheme = '';
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    if (event.target.type === 'checkbox') {
      user[field] = event.target.checked;
    } else {
      user[field] = event.target.value;
    }
    this.setState({
      user
    });
  }

  handlePropertyChange(propertyChangeEvent) {
    const user = this.state.user;
    console.log(
      'MANOJ sent propertyChangeEvent handlePropertyChange' +
        propertyChangeEvent
    );
    if (propertyChangeEvent.event.id === 'authscheme1') {
      user.authscheme1 =
        authSchemePrimary[propertyChangeEvent.event.value.key].name;
    }
    if (propertyChangeEvent.event.id === 'authscheme2') {
      user.authscheme2 =
        authSchemeSecondary[propertyChangeEvent.event.value.key].name;
    }
    this.setState({
      user
    });
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  async processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const remember = encodeURIComponent(this.state.user.remember);
    const authscheme1 = encodeURIComponent(this.state.user.authscheme1);
    const authscheme2 = encodeURIComponent(this.state.user.authscheme2);

    const formData = `email=${email}&password=${password}&remember=${remember}&authscheme1=${authscheme1}&authscheme2=${authscheme2}`;
    const url = `/interaction/${this.uuid}/login`;

    try {
      var response = await fetch(url, {
        // credentials: 'include', //pass cookies, for authentication
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
        },
        body: formData
      });
      // No Error {"error":"invalid_request","error_description":"unrecognized route"}"
      // change the component-container state
      if (
        response.status === 200 &&
        response.redirected === false &&
        !(this.state.user.authscheme1 === 'SAML')
      ) {
        const resData = await response.json();
        console.log(
          'MANOJ processLoginForm ****' + JSON.stringify(resData, null, 4)
        );
        const loginResp = resData.response;
        this.loginResp = loginResp;
        this.isRedirected = false;
        this.isLoggedIn = true;

        const attrs = loginResp.details.params.scope.split(' ');
        this.attributes = { attrs };
        this.isChained = loginResp.isChained;
        this.chainedAuthScheme = loginResp.chainedAuthScheme;
        this.setState({
          errors: {}
        });
      } else if (
        response.status === 200 &&
        response.redirected === false &&
        this.state.user.authscheme1 === 'SAML'
      ) {
        const resData = await response.json();
        console.log(
          'MANOJ processLoginForm SAML ****' + JSON.stringify(resData, null, 4)
        );
        this.isRedirected = true;
        const loginResp = resData.response;
        this.loginResp = loginResp;
        // this.redirectLocation = resData.response.samlLoginGrant;
        //window.location.replace('https://community.smartthings.com/t/oauth-response-for-preflight-is-invalid/51967');//(this.redirectLocation);
        // window.location.replace(this.redirectLocation);
        this.setState({
          errors: {}
        });
      } else {
        // change the component state
        error = response.statusText;
        const errors = { error };
        errors.summary = error.error_description;

        this.setState({
          errors
        });
      }
    } catch (error) {
      // change the component state
      const errors = { error };
      errors.summary = error.message;

      this.setState({
        errors
      });
    }
  }

  /**
   * Render the component.
   */
  render() {
    if (this.state.user.authscheme1 === 'SAML' && this.isRedirected) {
      console.log('MANOJ processLoginForm SAML ****' + this.loginResp);
      //   return null;
      // return (
      //     <div>
      //         <RawHTMLPage content={this.loginResp} />
      //     </div>
      // )
      const samlFormData = {
        idpSSOurl: this.loginResp.idpSSOurl,
        samlAuthNRequest: this.loginResp.samlAuthNRequest,
        relayStateParam: this.loginResp.relayStateParam
      };
      return (
        <div>
          <SAMLRequestPage {...samlFormData} />
        </div>
      );
    }
    if (!this.isLoggedIn) {
      return (
        <AuthnLoginForm
          onSubmit={this.processForm}
          onChange={this.changeUser}
          onPropertyChange={this.handlePropertyChange}
          errors={this.state.errors}
          successMessage={this.state.successMessage}
          user={this.state.user}
        />
      );
    } else if (this.isLoggedIn && !this.isChained) {
      const consentFormData = {
        details: this.loginResp.details,
        account: this.loginResp.account
      };
      return (
        <div>
          <ConsentPage {...consentFormData} />
        </div>
      );
    } else {
      const chainedFormData = {
        details: this.loginResp.details,
        account: this.loginResp.account,
        chainedAuthScheme: this.chainedAuthScheme
      };
      return (
        <div>
          <OTPPanelPage {...chainedFormData} />
        </div>
      );
    }
  }
}

AuthnLoginPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default AuthnLoginPage;
