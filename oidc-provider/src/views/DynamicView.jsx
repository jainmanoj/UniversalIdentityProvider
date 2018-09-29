import React, { Component } from 'react'
import TestPage from './TestPage.jsx'

class DynamicView extends Component {
    constructor(props) {
        super(props)

        let viewData = this.props.staticContext.viewData
        // if (__isBrowser__) {
        //     viewData = window.__INITIAL_DATA__
        //     delete window.__INITIAL_DATA__
        // } else {
        //     viewData = this.props.staticContext.viewData
        // }

        this.state = {
            viewData,
            Component: null,
            error: {}
        }

    }

    componentDidMount() {
        // const viewName = this.props.match.params.viewId;
        const viewName ='TestPage'
        console.log("Rendering dynamic 1 " + viewName)
        if (viewName === 'TestPage') {
            this.setState({ Component: TestPage })

        }
    }

    render() {
        window.location.replace('/authn/testlogin');//(this.redirectLocation);
        // const { Component } = this.state
        // if (Component) {
        //     console.log("Rendering dynamic 2 " + Component)
        //     return (
        //         <div>
        //             <Component {...this.props} {...this.state.viewData} />
        //         </div>
        //     )
        // }
        // return null
    }

}

export default DynamicView




