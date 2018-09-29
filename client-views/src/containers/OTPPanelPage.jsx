import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ConsentPage from './ConsentPage.jsx';

class OTPPanelPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.authScheme = {
      uuid: props.details.uuid,
      scheme: props.chainedAuthScheme,
      account: props.account.accountId,
      validateUrl: ``,
      totp: ''
    };
    (this.isLoggedIn = false), (this.loginResp = {});
    this.attributes = {};
    this.isChained = true;
    this.chainedAuthScheme = '';
    this.authScheme.validateUrl = `/interaction/${
      this.authScheme.uuid
    }/login/chain/${this.authScheme.scheme}`;
    //    this.validateUrl = `/interaction/${this.authScheme.uuid}/login/chain/${this.authScheme.scheme}`;
  }

  async processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const accountId = encodeURIComponent(this.authScheme.account);
    const totp = this.authScheme.totp;

    const formData = `totp=${totp}&accountId=${accountId}`;
    const url = this.authScheme.validateUrl;

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
      if (response.status === 200 && response.redirected === false) {
        const resData = await response.json();
        console.log(
          'MANOJ processOTPForm ****' + JSON.stringify(resData, null, 4)
        );
        const loginResp = resData.response;
        const attrs = loginResp.details.params.scope.split(' ');
        this.attributes = { attrs };

        this.loginResp = loginResp;
        this.isChained = false;
        this.chainedAuthScheme = loginResp.chainedAuthScheme;

        this.setState({
          errors: {}
        });
      } else {
        // change the component state
        const error = response.statusText;
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

  onChange(event) {
    const field = event.target.name;
    const authScheme = this.authScheme;
    authScheme[field] = event.target.value;

    this.setState({
      authScheme
    });
  }

  render() {
    let renderElements = () => (
      <Card className="container-dialog">
        <form action="/" onSubmit={this.processForm.bind(this)}>
          <h2 className="card-heading">Validete OTP</h2>
          <div className="field-line">
            <TextField
              floatingLabelText="OTP"
              name="totp"
              onChange={this.onChange.bind(this)}
              value={this.authScheme.totp}
            />
          </div>

          <div className="button-line">
            <RaisedButton type="submit" label="Validate OTP" primary />
          </div>
        </form>
      </Card>
    );
    if (this.isChained) {
      return renderElements();
    } else {
      const consentFormData = {
        details: this.loginResp.details,
        account: this.loginResp.account
      };
      return (
        <div>
          <ConsentPage {...consentFormData} />
        </div>
      );
    }
  }
}
export default OTPPanelPage;
