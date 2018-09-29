//WE ARE NOT USING THIS - Will Do it later
// import React from 'react';
// import PropTypes from 'prop-types';
// // import ConsentForm from '../components/ConsentForm.jsx';
// import ConsentForm from './ConsentForm.jsx';

// export class ConsentPage extends React.Component {
//   constructor(props, context) {
//     super(props, context);
//     // set the initial component state
//     this.state = {
//       errors: {},
//       //attributes: this.splitAttribute(props.details.params.scope)
//       attributes: this.splitAttribute('email profile phone oidc test')
//     };
//     this.processAttributes = this.processAttributes.bind(this);
//     this.changeAttributes = this.changeAttributes.bind(this);

//     // this.uuid = props.details.uuid;
//     // this.accountId = props.account.accountId;
//     this.isRedirect = false;
//     this.redirectLocation = '';
//   }

//   // componentDidMount() {

//   // }

//   async processAttributes(event) {
//     // prevent default action. in this case, action is the form submission event
//     event.preventDefault();
//     // console.log("MANOJ processAttributes ****" + event);
//     const url = `/interaction/${this.uuid}/consent`;
//     const formData = `accountId=${
//       this.accountId
//     }&consent=${this.buildConsent()}`;
//     try {
//       var response = await fetch(url, {
//         credentials: 'include', //pass cookies, for authentication -- On server side enable cors  with Access-Control-Allow-Credentials: true
//         method: 'post',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
//           redirect: 'follow'
//         },
//         body: formData
//       });
//       // No Error {"error":"invalid_request","error_description":"unrecognized route"}"
//       // change the component-container state
//       if (response.status === 200 && response.redirected === true) {
//         this.isRedirect = true;
//         this.redirectLocation = response.url;
//         //window.location.replace('https://community.smartthings.com/t/oauth-response-for-preflight-is-invalid/51967');//(this.redirectLocation);
//         window.location.replace(this.redirectLocation);
//         this.setState({
//           errors: {}
//         });

//         // this.props.history.push(response.url);
//       } else {
//         // change the component state
//         error = response.statusText;
//         const errors = { error };
//         errors.summary = error.error_description;

//         this.setState({
//           errors
//         });
//       }
//     } catch (error) {
//       // change the component state
//       const errors = { error };
//       errors.summary = error.message;

//       this.setState({
//         errors
//       });
//     }
//   }

//   buildConsent() {
//     var consent = {};
//     const attrs = this.state.attributes;
//     attrs.forEach((attr, index) => {
//       if (attr.name && attr.isSelected) {
//         consent[attr.name] = attr.isSelected;
//       }
//     });
//     return JSON.stringify(consent);
//   }

//   async changeAttributes(selectedAttributeEvents) {
//     // console.log("MANOJ selectedAttributeEvents ****" + JSON.stringify(selectedAttributeEvents, null, 4));
//     let events = [];
//     if (selectedAttributeEvents instanceof Array) {
//       events = selectedAttributeEvents;
//     } else {
//       events = [selectedAttributeEvents];
//       const testAttribute = this.state.attributes[selectedAttributeEvents];
//       const toggleState = testAttribute.isSelected ? false : true;
//       this.state.attributes[selectedAttributeEvents].isSelected = toggleState;
//       this.setState({ errors: {} });
//     }
//     const selectedAttributes = [];
//     events.forEach((selectedAttributeEvent, index) => {
//       const testAttribute = this.state.attributes[selectedAttributeEvent];
//       if (testAttribute.id === selectedAttributeEvent) {
//         // const toggleState= testAttribute.isSelected ? false : true;
//         // (this.state.attributes[selectedAttributeEvent]).isSelected = toggleState;
//         selectedAttributes.push(this.state.attributes[selectedAttributeEvent]);
//       }
//     });
//     // console.log("MANOJ changeAttributes ****" + JSON.stringify(this.state.attributes, null, 4));
//   }

//   splitAttribute(scope) {
//     const attrs = [];
//     scope.split(' ').forEach((attribute, index) => {
//       const jsonObj = {
//         id: index,
//         name: attribute,
//         isSelected: true
//       };
//       attrs.push(jsonObj);
//     });
//     return attrs;
//   }

//   /**
//    * Render the component.
//    */
//   render() {
//     if (!this.isRedirect) {
//       console.log('MANOJ Rendering Concent To  ****' + this.redirectLocation);
//       return (
//         <ConsentForm
//           attributes={this.state.attributes}
//           onSubmit={this.processAttributes}
//           onChange={this.changeAttributes}
//         />
//       );
//     } else {
//       console.log('MANOJ reirecting To  ****' + this.redirectLocation);
//       return null;
//       // return(
//       //     <Redirect push to={this.redirectLocation} />
//       // );
//     }
//   }
// }

// ConsentPage.contextTypes = {
//   router: PropTypes.object,
//   details: PropTypes.object
// };
// ConsentPage.propTypes = {
//   details: PropTypes.object,
//   account: PropTypes.object
// };

// export default ConsentPage;
