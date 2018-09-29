import React, { Component } from "react";

export class AppRedirectPage extends Component {
  constructor( props, context) {
    super(props, context);
    console.log("MANOJ AppRedirectPage reirecting To  ****" + JSON.stringify(props, null, 4));
    this.state = { ...props };
  }
  componentWillMount(){
    window.location = this.state.route.redirectUri;
  }
  render(){
    return (<section>Redirecting...</section>);
  }
}

export default AppRedirectPage;