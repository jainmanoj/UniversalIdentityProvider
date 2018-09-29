//This is placeholder for all scheme
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
// import Typography from '@material-ui/core/Typography';
// import RestoreIcon from '@material-ui/icons/Restore';
// import FavoriteIcon from '@material-ui/icons/Favorite';
import CommonIcon from '@material-ui/icons/AddBox';

import LOCALCardPanelPage from './LOCALCardPanelPage';
import LDAPCardPanelPage from './LDAPCardPanelPage';
import SAMLCardPanelPage from './SAMLCardPanelPage';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 2,
    justifyContent: 'left'
  },
  card: {
    maxWidth: 500,
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
  },
  label: {
    color: '#fff',
    backgroundColor: 'red'
  }
});

const authSchemePrimaryx = [
  { key: 'local', name: 'Local' },
  { key: 'ldap', name: 'LDAP' },
  { key: 'saml', name: 'SAML' }
];
function getLoginPanelContent(selected) {
  switch (selected) {
    case 0:
      return <LOCALCardPanelPage />;
    case 1:
      return <LDAPCardPanelPage />;
    case 2:
      return <SAMLCardPanelPage />;
    default:
      throw new Error('Unknown step');
  }
}

class LoginContainerPanel extends React.Component {
  state = {
    value: 0,
    activePanel: 'LOCAL'
  };
  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root} justifycontent="center">
        <Card className={classes.card}>
          <CardContent>{getLoginPanelContent(this.state.value)}</CardContent>
          <CardActions>
            <BottomNavigation
              value={value}
              onChange={this.handleChange}
              showLabels
              className={classes.root}
            >
              {authSchemePrimaryx.map(({ key, name }) => (
                <BottomNavigationAction
                  key={key}
                  label={name}
                  icon={<CommonIcon />}
                />
              ))}
            </BottomNavigation>
          </CardActions>
        </Card>
      </div>
    );
  }
}

LoginContainerPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoginContainerPanel);
