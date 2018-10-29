const { Router } = require('express');
 const attachTo = (app, repository, jobs) => {
  const router = new Router();
   router
    .get('/check', (req, res) => {
      res.status(200).json({ status: 'ok' });
    })
    
   app.use('/health', router);
};
 module.exports = { attachTo };