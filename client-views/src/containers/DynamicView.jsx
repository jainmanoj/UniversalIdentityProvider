import React, { Component } from 'react'
import TestPage from './TestPage.jsx'
import OTPPanelPage from './OTPPanelPage.jsx'
import ConsentPage from './ConsentPage.jsx'
import SAMLRequestPage from './SAMLRequestPage.jsx'
import SAMLAssertionPage from './SAMLAssertionPage.jsx'

const ssrViews ={
    'TestPage' : TestPage,
    'OTP' : OTPPanelPage,
    'CONSENT' : ConsentPage,
    'SAMLREQUEST' :SAMLRequestPage,
    'SAMLASSERTION' : SAMLAssertionPage,

}

class DynamicView extends Component {
    constructor(props) {
        super(props)

        let viewData;
        if (__isBrowser__) {
            // console.log("isBrowser " + window.__INITIAL_DATA__);
            viewData = window.__INITIAL_DATA__
            delete window.__INITIAL_DATA__
        } else {
            // console.log("isServer " + this.props.staticContext);
            viewData = this.props.staticContext.viewData
        }

        this.state = {
            viewData,
            Component: null,
            error: {}
        }
    }

    componentDidMount() {
        // const viewName = this.props.match.params.viewId;
        const viewName = this.state.viewData.view;
        // console.log("Rendering dynamic 1 " + viewName)
        const ssrViewPage = ssrViews[viewName]; // we can also use `ssrViews.${viewName}`
        if (ssrViewPage){
            this.setState({ Component: ssrViewPage })
        } else {
            //This should be NotFound Page
            // this.setState({ Component: TestPage })
        }
    }

    render() {
        const { Component } = this.state
        if (Component) {
            // console.log("Rendering dynamic 2 " + Component)
            return (
                <div>
                    <Component {...this.props} {...this.state.viewData.params} />
                </div>
            )
        }
        return null
    }
}

export default DynamicView




