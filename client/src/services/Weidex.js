import requester from './requester';

const Weidex = {
  sync: () => {
    // TODO: Get id from somewhere
    requester.Weidex.sync().then((response) => {
      // Handle the FE sync here
    })
  }
};

export default Weidex;
