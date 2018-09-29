import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ConsentPage from './ConsentPage.jsx';

class SAMLRequestPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.idpSSOurl = props.idpSSOurl;
        this.samlAuthNRequest = props.samlAuthNRequest;
        this.relayStateParam = props.relayStateParam;

        this.autoSubmit = false;
    }

    componentWillMount() { 
    }

    async processSAMLForm(event) {
        // prevent default action. in this case, action is the form submission event
        event.preventDefault();
    }
    onChange(event) {
    }
    render() {
        let renderElements = () => (
            <Card className="container-dialog">
                <form action={this.idpSSOurl} method="post" >
                    <h2 className="card-heading">SAML Request</h2>
                    <div className="field-line">
                        <TextField
                            floatingLabelText="SAMLRequest"
                            name="SAMLRequest"
                            value={this.samlAuthNRequest}
                        />
                    </div>
                    <div className="field-line">
                        <TextField
                            floatingLabelText="RelayState"
                            name="RelayState"
                            value={this.relayStateParam}
                        />
                    </div>
                    <div className="button-line">
                        <RaisedButton type="submit" label="AUTO Submit SAMLRequest" primary />
                    </div>

                </form>
            </Card>

        );
        if (!this.autoSubmit) {
            return (
                renderElements()
            )
        } else {
            const consentFormData = {
            }
            return (
                <div>
                    <ConsentPage  {...consentFormData} />
                </div>

            );
        }
    }

}
export default SAMLRequestPage;