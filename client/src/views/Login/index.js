import { withRouter } from 'react-router-dom';
import AuthService from './../../services/AuthService';


export default withRouter(({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    AuthService.receiveAuthentication();
  } else {
    AuthService.signIn();
  }
  return (null);
});
