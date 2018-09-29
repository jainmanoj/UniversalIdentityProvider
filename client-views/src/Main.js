import React, { Component } from 'react';
// import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import routes from './routes.js';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch,
  withRouter
} from 'react-router-dom';

import Base from './components/Base';
import HomePage from './components/HomePage';
import LoginPage from './containers/LoginPage';
import LogoutFunction from './containers/LogoutFunction';
import SignUpPage from './containers/SignUpPage.jsx';
import DashboardPage from './containers/DashboardPage.jsx';
import Auth from './modules/Auth';
import TestLoginForm from './containers/TestLoginForm.jsx';
import AuthnLoginPage from './containers/AuthnLoginPage.jsx';
import RawHTMLPage from './containers/RawHTMLPage.jsx';
import AppRedirectToPage from './containers/AppRedirectToPage.jsx';
import DynamicView from './containers/DynamicView.jsx';
import TestPage from './containers/TestPage.jsx';
import LOCALCardPanelPage from './mui-views/views/containers/LDAPCardPanelPage.jsx';
import LoginContainerPanel from './mui-views/views/containers/LoginContainerPanel';
import ConsentPage from './mui-views/views/containers//ConsentPage';
// remove tap delay, essential for MaterialUI to work properly
//./mui-views/views/containers/LOCALCardPanelPage
// /home/ct-developer/NODEPRJ/cosmaze-cloud-identity/client-views/src/Main.js
///home/ct-developer/NODEPRJ/cosmaze-cloud-identity/client-views/src/mui-views/views/containers/LDAPCardPanelPage.jsx
// injectTapEventPlugin();

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.isUserAuthenticated() ? (
        <Component {...props} {...rest} />
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

const LoggedOutRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.isUserAuthenticated() ? (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location }
          }}
        />
      ) : (
        <Component {...props} {...rest} />
      )
    }
  />
);

const PropsRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => <Component {...props} {...rest} />} />
);
const rawHtmlString = () => {
  const html = `
<html>
<script>
	function pClicked() {
		console.log("p is clicked");
    }
</script>
<body>
<button autofocus type="submit" 
onclick="(function() {
  console.log('p is clicked');
})()"
name="submit" class="login login-submit">Approve</button>
</body>
</html>
`;

  return html;
};

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: true
    };
  }

  componentDidMount() {
    // check if user is logged in on refresh
    this.toggleAuthenticateStatus();
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Router>
          <div>
            <div className="top-bar">
              <div className="top-bar-left">
                <Link to="/authn">React App</Link>
              </div>
              {this.state.authenticated ? (
                <div className="top-bar-right">
                  <Link to="/authn/dashboard">Dashboard</Link>
                  <Link to="/authn/logout">Log out</Link>
                </div>
              ) : (
                <div className="top-bar-right">
                  <Link to="/authn/login">Log in</Link>
                  <Link to="/authn/signup">Sign up</Link>
                </div>
              )}
            </div>

            <Switch>
              <PropsRoute
                exact
                path="/authn"
                component={HomePage}
                toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()}
              />
              <PrivateRoute path="/authn/dashboard" component={DashboardPage} />
              <LoggedOutRoute
                path="/authn/login"
                component={LoginPage}
                toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()}
              />
              <LoggedOutRoute path="/authn/signup" component={SignUpPage} />
              <Route path="/authn/logout" component={LogoutFunction} />

              <Route
                path="/authn/authlogin/:uuid"
                name="authlogin"
                component={LoginContainerPanel}
              />

              <Route
                path="/authn/authn/:uuid"
                name="authloginnew"
                component={AuthnLoginPage}
              />
              <Route
                exact
                path="/authn/testlogin"
                name="testlogin"
                component={TestLoginForm}
              />
              <Route
                path="/authn/testhtml"
                render={() => {
                  return (
                    <RawHTMLPage
                      content={'<p>This is Raw HTML Render...</p>'}
                    />
                  );
                }}
              />
              <Route
                exact
                path="/authn/testpage"
                name="testpage"
                component={TestPage}
              />
              <Route
                exact
                path="/authn/testmui"
                name="testpagemui"
                component={ConsentPage}
              />
              <Route render={props => <DynamicView {...props} />} />
            </Switch>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default Main;
