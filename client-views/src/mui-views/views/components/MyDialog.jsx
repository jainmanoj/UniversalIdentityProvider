import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20
  }
});
class MyDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
    console.log(`Manoj MyDialog--> ${JSON.stringify(props, null, 4)}`);
  }

  handleClose = () => {
    this.props.onClose();
  };

  render() {
    console.log(
      `Manoj MyDialog render --> ${JSON.stringify(this.props, null, 4)}`
    );
    return (
      <div>
        <Dialog open={this.props.openMFA} onClose={this.handleClose}>
          <DialogTitle>My Dialog</DialogTitle>
          <DialogContent>
            <DialogContentText>1-2-3-4-5</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

MyDialog.propTypes = {
  openMFA: PropTypes.bool,
  onClose: PropTypes.func
};
export default withRoot(withStyles(styles)(MyDialog));
