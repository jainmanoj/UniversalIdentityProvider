import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ConsentPage from './ConsentPage.jsx';

class SAMLAssertionPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.callbackUrl = props.callbackUrl;
        this.options = props.options;
        this.userDetails = props.userDetails;

        this.autoSubmit = false;
    }

    componentWillMount() { 
    }

    async processSAMLAssertion(event) {
        // prevent default action. in this case, action is the form submission event
        event.preventDefault();
    }
    onChange(event) {
    }
    render() {
        let renderElements = () => (
            <Card className="container-dialog">
                <form action={this.callbackUrl} method="post" >
                    <h2 className="card-heading">SAML Assertion</h2>
                    <div className="field-line">
                        <TextField
                            floatingLabelText="Options"
                            name="options"
                            value={this.options}
                        />
                    </div>
                    <div className="field-line">
                        <TextField
                            floatingLabelText="User Details"
                            name="userDetails"
                            value={this.userDetails}
                        />
                    </div>
                    <div className="button-line">
                        <RaisedButton type="submit" label="AUTO Submit SAMLAssertion" primary />
                    </div>

                </form>
            </Card>

        );
        if (!this.autoSubmit) {
            return (
                renderElements()
            )
        }  else {
            return null;
        }
    }

}
export default SAMLAssertionPage;