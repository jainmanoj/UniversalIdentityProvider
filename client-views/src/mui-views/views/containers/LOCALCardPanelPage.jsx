import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import UniLoginForm from './UniLoginForm';

import ConsentPage from '../../../containers/ConsentPage.jsx';
import OTPPanelPage from '../../../containers/OTPPanelPage.jsx';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 2,
    justifyContent: 'left'
  },
  card: {
    maxWidth: 345,
    margin: 'auto',
    textAlign: 'center',
    width: 700
  },
  row: {
    display: 'flex',
    justifyContent: 'left'
  },
  rowc: {
    display: 'flex',
    justifyContent: 'center'
  },
  avatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: 'red'
  }
});

class LOCALCardPanelPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      errors: {},
      openMFADlg: false,
      authSchemeSecondary: ''
    };
    this.authParms = {
      userid: '',
      password: '',
      authScheme1: 'LOCAL',
      authScheme2: 'NONE',
      rememberMe: true
    };
    const { uuid } = this.context.router.route.match.params;
    this.uuid = uuid;

    this.isLoggedIn = false;
    this.loginResp = {};
    this.testUni = true;
    // this.attributes = {};
    // this.isChained = false;
    // this.chainedAuthScheme = '';
  }

  //callback with params use currying of form handleClick = (param) => (e) => { }
  // handleChange = name => event => {
  //   if (event.target.type === 'checkbox') {
  //     this.authParms[name] = event.target.checked;
  //   } else if (event.target.type === 'text') {
  //     this.authParms[name] = event.target.value;
  //   } else if (event.target.type === 'password') {
  //     this.authParms[name] = event.target.value;
  //   }

  //   const istate = this.state;
  //   this.setState(istate);
  // };

  handleChange(event, name) {
    if (event.target.type === 'checkbox') {
      this.authParms[name] = event.target.checked;
    } else if (event.target.type === 'text') {
      this.authParms[name] = event.target.value;
    } else if (event.target.type === 'password') {
      this.authParms[name] = event.target.value;
    }
    const istate = this.state;
    this.setState(istate);
  }

  onMFAButtonClicked(event) {
    this.onOpenDialog();
  }

  onOpenDialog() {
    this.setState({ openMFADlg: true });
  }

  onCloseDialog(authSchemeSecondary) {
    this.authParms['authScheme2'] = authSchemeSecondary;
    this.setState({
      openMFADlg: false
    });
  }

  async processAuth(event) {
    console.log(
      `Manoj LoginCardPanelPage before render --> ${JSON.stringify(
        this.authParms,
        null,
        4
      )}`
    );

    // prevent default action. in this case, action is the form submission event
    // event.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(this.authParms.userid);
    const password = encodeURIComponent(this.authParms.password);
    const remember = encodeURIComponent(this.authParms.rememberMe);
    const authscheme1 = encodeURIComponent(this.authParms.authScheme1);
    const authscheme2 = encodeURIComponent(this.authParms.authScheme2);

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
        this.authParms.authScheme1 === 'LOCAL'
      ) {
        const resData = await response.json();
        console.log(
          'MANOJ processLoginForm ****' + JSON.stringify(resData, null, 4)
        );
        this.loginResp = resData.response;
        this.isLoggedIn = true;
        this.isChained = this.loginResp.isChained;
        this.chainedAuthScheme = this.loginResp.chainedAuthScheme;
        // const attrs = this.loginResp.details.params.scope.split(' ');
        // this.attributes = { attrs };
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

  render() {
    const { classes } = this.props;
    if (!this.isLoggedIn && this.testUni) {
      return (
        <UniLoginForm
          onChange={(event, name) => this.handleChange(event, name)}
          onSubmit={event => this.processAuth(event)}
          onMFAButtonClicked={event => this.onMFAButtonClicked(event)}
          onCloseDialog={name => this.onCloseDialog(name)}
          state={this.state}
          authParms={this.authParms}
          classes={this.classes}
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
LOCALCardPanelPage.contextTypes = {
  router: PropTypes.object.isRequired
};

LOCALCardPanelPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(LOCALCardPanelPage));
