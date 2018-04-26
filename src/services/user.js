import { reject } from 'bluebird-lst';

const initUserData = {
  selectedPortfolio: 0,
};

const User = {
  getUserData: () => new Promise((resolve, reject) => {
    setTimeout(() => {
      const userData = JSON.parse(window.localStorage.getItem('cb_user'));
      console.log(userData || initUserData);
      resolve(userData || initUserData);
    }, 500);
  }),

  setUserData: newUserData => new Promise((resolve, reject) => {
    setTimeout(() => {
      window.localStorage.setItem('cb_user', JSON.stringify(newUserData));
      resolve(newUserData);
    }, 500);
  }),
};

export default User;
