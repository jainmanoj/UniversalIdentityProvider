import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import MFADialogPage from './MFADialogPage';
import { withStyles } from '@material-ui/core/styles';

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

const UniLoginForm = ({
  onChange,
  onSubmit,
  onMFAButtonClicked,
  onCloseDialog,
  state,
  authParms,
  classes
}) => (
  <div className={classes.root} justifycontent="center">
    <Card className={classes.card}>
      <div className={classes.rowc}>
        <Avatar className={classes.avatar}>
          <LockIcon />
        </Avatar>
      </div>

      <CardContent>
        {authParms.authScheme1 === 'LOCAL' ? (
          <Typography variant="headline">Local Authentication</Typography>
        ) : null}
        {authParms.authScheme1 === 'LDAP' ? (
          <Typography variant="headline">LDAP Authentication</Typography>
        ) : null}
        {authParms.authScheme1 === 'SAML' ? (
          <Typography variant="headline">SAML Authentication</Typography>
        ) : null}
        <span>&nbsp;</span>
        <form className={classes.form}>
          {authParms.authScheme1 === 'LOCAL' ? (
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="userid"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={e => onChange(e, 'userid')}
                value={authParms.userid}
              />
            </FormControl>
          ) : null}
          {authParms.authScheme1 === 'LDAP' ? (
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="text">SAMAccount/Domain user</InputLabel>
              <Input
                id="userid"
                name="text"
                autoComplete="text"
                autoFocus
                onChange={e => onChange(e, 'userid')}
                value={authParms.userid}
              />
            </FormControl>
          ) : null}

          {(authParms.authScheme1 === 'LOCAL' ||
          authParms.authScheme1 === 'LDAP') ? (
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={e => onChange(e, 'password')}
                value={authParms.password}
              />
            </FormControl>
          ) : null}

          <div className={classes.row}>
            <Button
              variant="raised"
              color="secondary"
              onClick={e => onMFAButtonClicked(e)}
            >
              Enable MFA
            </Button>
          </div>

          <div className={classes.row}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={authParms.rememberMe}
                  onChange={e => onChange(e, 'rememberMe')}
                  value="rememberMe"
                  color="primary"
                />
              }
              label="Remember Me"
              labelPlacement="end"
            />
          </div>
        </form>
      </CardContent>
      <CardActions>
        <Button
          type="submit"
          fullWidth
          variant="raised"
          color="primary"
          onClick={e => onSubmit(e)}
        >
          Sign in
        </Button>
      </CardActions>
    </Card>
    {state.openMFADlg ? (
      <MFADialogPage
        openMFA={state.openMFADlg} //Pass to open Child component
        onClose={authScheme2 => onCloseDialog(authScheme2)} //Pass a callback to close //{e => onMFAButtonClicked(e)}
      />
    ) : null}
  </div>
);
UniLoginForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onMFAButtonClicked: PropTypes.func.isRequired,
  onCloseDialog: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired,
  authParms: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UniLoginForm);
