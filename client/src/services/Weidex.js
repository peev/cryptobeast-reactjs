import requester from './requester';

const Weidex = {
  sync: (data) => {
    // TODO: Get id from somewhere
    requester.Weidex.sync(data).then((response) => {
      // Handle the FE sync here
    })
  }
};

export default Weidex;
