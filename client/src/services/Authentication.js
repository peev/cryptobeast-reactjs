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

  // work in progress
  getUserIdToken = () => localStorage.getItem('id_token');

  getUserProfile = () => JSON.parse(localStorage.getItem('profile'));

  getUserProfileId = () => this.getUserProfile().sub.slice(6); // removes the 'auth0|' at the start of id

  getUserData = () => {
    const request = {
      // url: `https://${domain}/api/v2/users/${this.getUserProfile().sub}`,
      url: `https://${domain}/api/v2/users/${this.getUserProfileId()}?fields=user_metadata&include_fields=true`,
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.getUserIdToken()}`,
      },
      mode: 'cors',
      cache: 'default',
    };
    console.log(request);

    return fetch(request)
      .catch(error => console.log(error));
  };

  patchUserData = (userData) => {
    const request = {
      // url: `https://${domain}/api/v2/users/${this.getUserProfileId()}`,
      url: `https://${domain}/api/v2/users/user_id`,
      // url: `https://${domain}/api/v2/user_id`,
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${this.getUserIdToken()}`,
      },
      body: userData,
      // mode: 'cors',
      // cache: 'default',
    };

    console.log(request, this.getUserProfileId());

    return fetch(request)
      .catch(error => console.log(error));
  };
}

const authService = new AuthService();
export default authService;
