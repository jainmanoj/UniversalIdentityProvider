import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';
import MFADialogPage from './MFADialogPage';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20
  }
});
class TestDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
    // console.log(`Manoj TestDialog--> ${JSON.stringify(props, null, 4)}`);
    this.state = {
      openMFADlg: false,
      authSchemeSecondary: ''
    };
  }

  onMFAButtonClicked() {
    this.onOpenDialog();
  }

  onOpenDialog() {
    this.setState({ openMFADlg: true });
  }

  onCloseDialog(authSchemeSecondary) {
    this.setState({
      openMFADlg: false,
      authSchemeSecondary: authSchemeSecondary
    });
  }

  render() {
    console.log(`Manoj TestDialog--> ${JSON.stringify(this.state, null, 4)}`);
    return (
      <div>
        <Button onClick={() => this.onMFAButtonClicked()} color="primary">
          Open MFA
        </Button>
        <MFADialogPage
          openMFA={this.state.openMFADlg} //Pass to open Child component
          onClose={authSchemeSecondary =>
            this.onCloseDialog(authSchemeSecondary)
          } //Pass a callback to close
        />
      </div>
    );
  }
}

export default withRoot(withStyles(styles)(TestDialog));
