import React from 'react';
import PropTypes from 'prop-types';

import LoginPage from './LoginPage.jsx';
import RawHTMLPage from './RawHTMLPage.jsx';
import ConsentPage from './ConsentPage.jsx';
import AuthnLoginPage from './AuthnLoginPage.jsx';
import OTPPanelPage from './OTPPanelPage.jsx';

class TestLoginForm extends React.Component {

  componentDidMount() {

  }

  render() {
    const params = { match: {params: '10000'}};
    const authScheme = {
            uuid :'100',
            scheme : "OTP",
            validateUrl : '',
            otp:''
    }
    authScheme.validateUrl= `/interaction/${authScheme.uuid}/login/chain/${authScheme.scheme}`;
    // return (
    //   <div>
    //     <RawHTMLPage  content={'<p>This is Raw HTML Render...</p>'} />
    //     <RawHTMLPage  content={'<p>This is Raw HTML Render...</p>'} />
    //     <ConsentPage {...params}/>
    //     <AuthnLoginPage />
    //   </div>
    // )
    // return (
    //   <div>
    //     <AuthnLoginPage { ...params } />
    //   </div>
    // )
    return (
      <OTPPanelPage {...authScheme} />
    )
  }
}

TestLoginForm.contextTypes = {
  router: PropTypes.object.isRequired
};

export default TestLoginForm;
