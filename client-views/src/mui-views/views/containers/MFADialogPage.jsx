import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20
  }
});

class MFADialogPage extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      authSchemeSecondary: ''
    };
  }

  handleCloseDialog = () => {
    this.props.onClose();
  };

  handleSchemeChange = name => event => {
    this.setState({ [name]: event.target.value });
    // console.log(`Manoj MyDialog--> ${JSON.stringify(this.state, null, 4)}`);
  };

  handleSchemeSelect = () => {
    // console.log(`Manoj MyDialog--> ${JSON.stringify(this.state, null, 4)}`);
    this.props.onClose(this.state.authSchemeSecondary);
  };

  render() {
    const { classes } = this.props;
    // const { open } = this.state;

    return (
      <div className={classes.root}>
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={this.props.openMFA}
          onClose={this.handleCloseDialog}
        >
          <DialogTitle>Select MFA Scheme</DialogTitle>
          <DialogContent>
            <form className={classes.form}>
              <FormControl fullWidth={true} className={classes.formControl}>
                <InputLabel htmlFor="age-simple">MFA Scheme</InputLabel>
                <Select
                  value={this.state.authSchemeSecondary}
                  onChange={this.handleSchemeChange('authSchemeSecondary')}
                  input={<Input id="authSchemeSecondary-simple" />}
                >
                  <MenuItem value={'NONE'}>NONE</MenuItem>
                  <MenuItem value={'OTP'}>OTP</MenuItem>
                  <MenuItem value={'RSASecureID'}>RSASecureID</MenuItem>
                  <MenuItem value={'Fingerprint'}>Fingerprint</MenuItem>
                  <MenuItem value={'Voice'}>Voice</MenuItem>
                  <MenuItem value={'Face'}>Face</MenuItem>
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSchemeSelect} color="primary">
              Select
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

MFADialogPage.propTypes = {
  classes: PropTypes.object,
  openMFA: PropTypes.bool,
  onClose: PropTypes.func
};

export default withRoot(withStyles(styles)(MFADialogPage));
