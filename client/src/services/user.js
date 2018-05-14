const initUserData = {
  selectedPortfolio: 0,
};

const User = {
  checkUserID: () => {
    const userData = JSON.parse(window.localStorage.getItem('cb_user')); //eslint-disable-line
    return userData !== null;
  },

  getUserData: () => new Promise((resolve) => {
    setTimeout(() => {
      const userData = JSON.parse(window.localStorage.getItem('cb_user')); //eslint-disable-line
      resolve(userData || initUserData);
    }, 500);
  }),

  setUserData: newUserData => new Promise((resolve) => {
    setTimeout(() => {
      window.localStorage.setItem('cb_user', JSON.stringify(newUserData)); //eslint-disable-line
      resolve(newUserData);
    }, 500);
  }),
};

export default User;
