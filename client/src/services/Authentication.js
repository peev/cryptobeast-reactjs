/* globals localStorage fetch */
import Auth0Lock from 'auth0-lock';
import history from './History';
import { clientId, domain, redirectUrl } from './../variables/auth0';
import Logo from './../assets/img/CryptoBeastLogo.svg';
import './../variables/auth_lock.css';

// LOCK v11 DOCUMENTATION
// https://auth0.com/docs/libraries/lock/v11/api
const options = {
  auth: {
    responseType: 'token id_token',
    redirectUri: redirectUrl,
    audience: 'https://cryptobeast.eu.auth0.com/userinfo',
    scope: 'openid profile',
  },
  rememberLastLogin: false,
  autoParseHash: false,
  allowAutocomplete: true,
  closable: false,
  allowedConnections: ['Username-Password-Authentication'],
  autoclose: true,
  autofocus: true,
  theme: {
    logo: Logo,
    primaryColor: '#22252F',
  },
  languageDictionary: {
    usernameInputPlaceholder: 'Username',
    passwordInputPlaceholder: 'Password',
    title: 'CryptoBeast',
    signupTitle: 'CryptoBeast',
    loginLabel: 'LOG IN',
    signUpLabel: 'SIGN UP',
    forgotPasswordAction: 'Forgot password?',
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
        localStorage.setItem('profile', JSON.stringify(profile));
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
    localStorage.setItem('accessToken', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    history.push('/');
  }

  signOut = () => {
    // // Clear Access Token and ID Token from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('profile');
    this.lock.logout({
      returnTo: redirectUrl,
    });
  }

  isAuthenticated = () => {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  isSignedOut = () => Boolean(!localStorage.getItem('accessToken') && !localStorage.getItem('profile'));

  getUserIdToken = () => localStorage.getItem('id_token');

  getUserProfile = () => JSON.parse(localStorage.getItem('profile'));
}

const authService = new AuthService();
export default authService;
