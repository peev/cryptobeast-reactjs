/* globals window */
const initPortfolioData = {
  selectedPortfolio: 0,
};

const storage = {

  setSelectedPortfolioId: id => new Promise((resolve) => {
    setTimeout(() => {
      window.localStorage.setItem('selected_portfolio_id', JSON.stringify(id));
      resolve(id);
    }, 1);
  }),

  getSelectedPortfolioId: () => new Promise((resolve) => {
    setTimeout(() => {
      const userData = JSON.parse(window.localStorage.getItem('selected_portfolio_id'));
      resolve(userData || initPortfolioData);
    }, 1);
  }),

  setPortfolioAddresses: addresses => new Promise((resolve) => {
    setTimeout(() => {
      window.localStorage.setItem('portfolio_user_addresses', JSON.stringify(addresses));
      resolve(addresses);
    }, 1);
  }),

  getPortfolioAddresses: () => new Promise((resolve) => {
    setTimeout(() => {
      const addressesData = JSON.parse(window.localStorage.getItem('portfolio_user_addresses'));
      resolve(addressesData || []);
    }, 1);
  }),
};

export default storage;
