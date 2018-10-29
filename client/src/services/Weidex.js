import requester from './requester';

const Weidex = {
  sync: (addresses) => {
    // TODO: Get id from somewhere
    requester.Weidex.sync(addresses).then((response) => {
      // Handle the FE sync here
    });
  },
};

export default Weidex;
