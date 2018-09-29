import React from 'react';
import AppBar from 'material-ui/AppBar';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';

class TestPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        console.log("Rendering TestPage 1 ");
    }


    getChildContext() {
        return { muiTheme: getMuiTheme(baseTheme) };
    }

    render() {
                console.log("Rendering TestPage 2 " +this.props);
        return (
            <div>
                <div className="button-line">
                    <RaisedButton type="submit" label={this.props.name} primary />
                </div>

            </div>
        );
    }
}

TestPage.childContextTypes = {
    muiTheme: PropTypes.object.isRequired,
};

export default TestPage;
