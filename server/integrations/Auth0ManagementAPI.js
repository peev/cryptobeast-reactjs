// const axios = require('axios');
// const { authManagementApi: { client_secret, client_id, domain } } = require('./../bin/config');


// class Auth0ManagementApi {
//   constructor() {
//     this.token = null;
//     this.expiresIn = null;
//     this.getToken();
//   }

//   async getToken() {
//     const { token, expiresIn } = this;
//     try {
//       if ((new Date().getTime() < JSON.parse(expiresIn))) return token;

//       const body = {
//         audience: `https://${domain}/api/v2/`,
//         grant_type: 'client_credentials',
//         client_id,
//         client_secret,
//       };
//       const options = { 'content-type': 'application/json' };
//       const { data: { access_token, expires_in } } = await axios.post(`https://${domain}/oauth/token`, body, options);
//       this.renewToken(access_token, JSON.stringify((expires_in * 1000) + new Date().getTime()));
//       return access_token;
//     } catch (error) {
//       return console.log(error); // eslint-disable-line
//     }
//   }

//   renewToken(newToken, expiration) {
//     this.token = newToken;
//     this.expiresIn = expiration;
//   }

//   // only for server side usage, don't expose
//   async getUser(req) {
//     try {
//       const options = { headers: { Authorization: `Bearer ${req.token}` } };
//       const { data } = await axios.get(`https://${domain}/api/v2/users/${encodeURI(req.user.sub)}`, options);

//       return data;
//     } catch (error) {
//       return error;
//     }
//   }

//   async patchUser(req, res) {
//     try {
//       const options = { headers: { Authorization: `Bearer ${req.token}` } };
//       const data = await axios.patch(`https://${domain}/api/v2/users/${encodeURI(req.params.id)}`, req.body, options);

//       if (data.status === 200) {
//         return res.status(200).send({ isSuccessful: true });
//       }

//       return res.status(404).send({ isSuccessful: false });
//     } catch (error) {
//       return res.status(500).send({ isSuccessful: false });
//     }
//   }
// }


// module.exports = Auth0ManagementApi;
