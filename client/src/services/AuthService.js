import auth0 from 'auth0-js';
import Auth0Lock from 'auth0-lock';
import history from './History';


class AuthService {
  auth0 = new auth0.WebAuth({
    domain: 'cryptobeast.eu.auth0.com',
    clientID: 'ro3TfD3x5qWYVH7EhI7IlpoHPK330NeQ',
    redirectUri: 'http://localhost:3000/login',
    audience: 'https://cryptobeast.eu.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid',
  });

  lock = new Auth0Lock(
    'ro3TfD3x5qWYVH7EhI7IlpoHPK330NeQ',
    'cryptobeast.eu.auth0.com',
    {
      auth: {
        responseType: 'token id_token',
        redirectUri: 'http://localhost:3000/login',
        scope: 'openid',
      },
      allowAutocomplete: true,
      allowedConnections: ['Username-Password-Authentication'],
      autoclose: true,
      autofocus: true,
      theme: {
        logo: 'https://rebootaccel.com/wp-content/uploads/2015/08/google-favicon-vector-400x400.png',
        primaryColor: '#31324F',
      },
    },
  ).on('authenticated', (authResult) => {
    // Use the token in authResult to getUserInfo() and save it to localStorage
    this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
      if (error) {
        // Handle error
        return;
      }
      this.persistSession(authResult);
      localStorage.setItem('profile', JSON.stringify(profile)); // eslint-disable-line
    });
  });

  signIn = () => {
    // this.auth0.authorize();
    this.lock.show();
  }

  receiveAuthentication = () => {
    // Looks for the result of authentication in the URL hash.
    // Then, the result is processed with the parseHash method from auth0.js
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.persistSession(authResult);
      } else if (err) {
        history.replace('/');
        console.log(err); // eslint-disable-line
      }
    });
  }

  persistSession = (authResult) => {
    // Access Token + ID Token + Expiry Time = SESSION
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken); // eslint-disable-line
    localStorage.setItem('id_token', authResult.idToken); // eslint-disable-line
    localStorage.setItem('expires_at', expiresAt); // eslint-disable-line
    // navigate to the home route
    history.replace('/');
  }

  signOut = () => {
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('access_token'); // eslint-disable-line
    localStorage.removeItem('id_token'); // eslint-disable-line
    localStorage.removeItem('expires_at'); // eslint-disable-line
    // navigate to the home route
    history.push('/');
  }

  isAuthenticated = () => {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at')); // eslint-disable-line
    return new Date().getTime() < expiresAt;
  }
}

const authService = new AuthService();
export default authService;
