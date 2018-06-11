import Auth0Lock from 'auth0-lock';
import history from './History';
import { clientId, domain, redirectUrl } from './../variables/auth0';


// LOCK v11 DOCUMENTATION
// https://auth0.com/docs/libraries/lock/v11/api
const options = {
  auth: {
    responseType: 'token id_token',
    redirectUri: redirectUrl,
    audience: 'https://cryptobeast.eu.auth0.com/userinfo',
    scope: 'openid',
  },
  autoParseHash: false,
  allowAutocomplete: true,
  allowedConnections: ['Username-Password-Authentication'],
  autoclose: true,
  autofocus: true,
  theme: {
    // logo: 'https://rebootaccel.com/wp-content/uploads/2015/08/google-favicon-vector-400x400.png',
    primaryColor: '#31324F',
  },
};

class AuthService {
  lock = new Auth0Lock(clientId, domain, options)
    .on('authenticated', authResult => this.fetchData(authResult));

  signIn = () => {
    this.lock.show();
  }

  getUserInfo = (authResult) => {
    // Use the token in authResult to getUserInfo() and save it to localStorage
    this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
      if (error) console.log(error); // eslint-disable-line
      else {
        this.persistSession(authResult);
        localStorage.setItem('profile', JSON.stringify(profile)); // eslint-disable-line
      }
    });
  }

  fetchData = (authResult) => {
    this.getUserInfo(authResult);
    history.push('/summary');
  }

  checkSession = () => {
    this.lock.checkSession({}, (err, authResult) => {
      if (err) {
        console.log('could not parse hash'); // eslint-disable-line
        return;
      }
      this.fetchData(authResult);
    });
  }

  receiveAuthentication = (hash) => {
    this.lock.resumeAuth(hash, (error, authResult) => {
      if (error) {
        console.log('could not parse hash'); // eslint-disable-line
        return;
      }
      this.fetchData(authResult);
    });
  }

  persistSession = (authResult) => {
    // Access Token + ID Token + Expiry Time = SESSION
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('accessToken', authResult.accessToken); // eslint-disable-line
    localStorage.setItem('id_token', authResult.idToken); // eslint-disable-line
    localStorage.setItem('expires_at', expiresAt); // eslint-disable-line
    // navigate to the home route
    history.push('/');
  }

  signOut = () => {
    // // Clear Access Token and ID Token from local storage
    localStorage.removeItem('accessToken'); // eslint-disable-line
    localStorage.removeItem('id_token'); // eslint-disable-line
    localStorage.removeItem('expires_at'); // eslint-disable-line
    localStorage.removeItem('profile'); // eslint-disable-line
    this.lock.logout({
      returnTo: redirectUrl,
    });
  }

  isAuthenticated = () => {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at')); // eslint-disable-line
    return new Date().getTime() < expiresAt;
  }

  isSignedOut = () => Boolean(!localStorage.getItem('accessToken') && !localStorage.getItem('profile')); // eslint-disable-line
}

const authService = new AuthService();
export default authService;
