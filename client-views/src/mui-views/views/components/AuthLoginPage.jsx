import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../../withRoot';

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20
  }
});

const AuthLoginPage = props => {
  // console.log(`Manoj Course--> ${JSON.stringify(props.course, null, 4)}`);
  return (
    <div>
      <Card className="container-dialog">
        <CardMedia style={{ height: 0, paddingTop: '56.25%' }} title="Login" />
        <Avatar>
          <LockIcon />
        </Avatar>

        <CardContent>
          <Typography variant="headline">Sign in with Local</Typography>
          <form>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input id="email" name="email" autoComplete="email" autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </FormControl>
          </form>
        </CardContent>
        <CardActions>
          <Button type="submit" fullWidth variant="raised" color="primary">
            Sign in
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

AuthLoginPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default AuthLoginPage;
