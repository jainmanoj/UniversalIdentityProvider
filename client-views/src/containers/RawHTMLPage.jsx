import React from 'react';
import PropTypes from 'prop-types';

class RawHTMLPage extends React.Component {
    constructor(props) {
        super(props)
    }
    rawMarkup() {
        var rawMarkup = this.props.content
        return { __html: rawMarkup };
    }
    render() {
        return (
            <div className="container">
                <span dangerouslySetInnerHTML={this.rawMarkup()} />

            </div>
        )
    }

}
export default RawHTMLPage;