/* globals window */
const initUserData = {
  selectedPortfolio: 0,
};

const User = {
  checkUserID: () => {
    const userData = JSON.parse(window.localStorage.getItem('cb_user'));
    return userData !== null;
  },

  getUserProfile: () => new Promise((resolve) => {
    const userData = JSON.parse(window.localStorage.getItem('profile'));
    resolve(userData || {});
  }),

  getUserData: () => new Promise((resolve) => {
    setTimeout(() => {
      const userData = JSON.parse(window.localStorage.getItem('cb_user'));
      resolve(userData || initUserData);
    }, 500);
  }),

  setUserData: newUserData => new Promise((resolve) => {
    setTimeout(() => {
      window.localStorage.setItem('cb_user', JSON.stringify(newUserData));
      resolve(newUserData);
    }, 500);
  }),
};

export default User;
