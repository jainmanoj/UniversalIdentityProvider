// import AuthLoginPage from 'views/components/AuthLoginPage';
// import TestPage from 'views/components/TestPage';
// import CourseList from 'views/components/CourseList';
// import NavBar from 'views/components/NavBar';
// import TestDialog from 'views/components/TestDialog';
import LOCALCardPanelPage from 'views/containers/LOCALCardPanelPage';
import LDAPCardPanelPage from 'views/containers/LDAPCardPanelPage';
import SAMLCardPanelPage from 'views/containers/SAMLCardPanelPage';
import LoginContainerPanel from 'views/containers/LoginContainerPanel';
import ConsentPage from 'views/ConsentPage';

var indexRoutes = [
  { path: '/testpage', name: 'TestPage', component: LoginContainerPanel },
  { path: '/testpage1', name: 'TestPage1', component: LOCALCardPanelPage },
  { path: '/testpage2', name: 'TestPage2', component: LDAPCardPanelPage },
  { path: '/testpage3', name: 'TestPage3', component: SAMLCardPanelPage },
  { path: '/testpage4', name: 'TestPage4', component: ConsentPage }
  // { path: '/testpage3', name: 'TestPage3', component: TestPage },
  // { path: '/testpage4', name: 'TestPage4', component: CourseList },
  // { path: '/testpage5', name: 'TestPage5', component: NavBar },
  // { path: '/testpage6', name: 'TestPage6', component: TestDialog }
];

export default indexRoutes;
