import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'



const authSchemePrimary = [
  { key: 'local', name: 'Local' },
  { key: 'ldap', name: 'LDAP' },
  { key: 'certs', name: 'Digital Certificates' },
  { key: 'saml', name: 'SAML' },
  { key: 'blockchain', name: 'Blockchain' }
];

const authSchemeSecondary = [
  { key: 'none', name: 'NONE' },
  { key: 'otp', name: 'OTP' },
  { key: 'rsaecureid', name: 'RSASecureID' },
  { key: 'fingerprint', name: 'Fingerprint' },
  { key: 'voice', name: 'Voice' },
  { key: 'face', name: 'Face' }
];

const AuthnLoginForm = ({
  onSubmit,
  onChange,
  onPropertyChange,
  errors,
  successMessage,
  user
}) => (


    <Card className="container-dialog">
      <form action="/" onSubmit={onSubmit}>
        <h2 className="card-heading">Login</h2>

        {successMessage && <p className="success-message">{successMessage}</p>}
        {errors.summary && <p className="error-message">{errors.summary}</p>}

        <div className="field-line">
          <TextField
            floatingLabelText="Email"
            name="email"
            errorText={errors.email}
            onChange={onChange}
            value={user.email}
          />
        </div>

        <div className="field-line">
          <TextField
            floatingLabelText="Password"
            type="password"
            name="password"
            onChange={onChange}
            errorText={errors.password}
            value={user.password}
          />
        </div>
        <div className="field-line">
          <SelectField id="authscheme1" value={user.authscheme1}
            onChange={
              (event, key, selected) => {
                console.log("MANOJ sent propertyChangeEvent form event " + event + "---" + key + "---" + selected)
                const propertyChangeEvent={};
                propertyChangeEvent.event = {
                  id : "authscheme1",
                  value : {
                    key : key,
                    value : selected
                   }
                }
                onPropertyChange(propertyChangeEvent);
              }
            }
            hintText='Primary Auth Scheme'>
            {authSchemePrimary.map(({ key, name }) => (
              <MenuItem key={key} primaryText={name} value={name} />
            ))}

          </SelectField>
        </div>

        <div>
          <SelectField name="authscheme2" value={user.authscheme2}
            onChange={
              (event, key, selected) => {
                console.log("MANOJ sent propertyChangeEvent form event " + event + "---" + key + "---" + selected)
                const propertyChangeEvent={};
                propertyChangeEvent.event = {
                  id : "authscheme2",
                  value : {
                    key : key,
                    value : selected
                   }
                }
                onPropertyChange(propertyChangeEvent);
              }
            }
            hintText='Secondary Auth Scheme'>
            {authSchemeSecondary.map(({ key, name }) => (
              <MenuItem key={key} primaryText={name} value={name} />
            ))}

          </SelectField>
        </div>


        <div>
          <Checkbox
            name="remember"
            label="RememberMe"
            labelPosition="left"
            onCheck={onChange}
          />
        </div>

        <div className="button-line">
          <RaisedButton type="submit" label="Log in" primary />
        </div>

        <CardText>Don't have an account? <Link to={'/signup'}>Create one</Link>.</CardText>
      </form>
    </Card>
  );


  AuthnLoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onPropertyChange : PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    successMessage: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired
  };

export default AuthnLoginForm;
