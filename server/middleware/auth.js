const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  req.session = {};
  if (Object.keys(req.cookies).length === 0) {
    models.Sessions.create()
      .then((data) => models.Sessions.get({id: data.insertId}))
      .then((data) => {
        req.session.hash = data.hash;
        res.cookie('shortlyid', data.hash);
        next();
      });
  } else {
    req.session.hash = req.cookies.shortlyid;
    models.Sessions.get({hash: req.session.hash})
      .then((data) => {
        if (data.userId) {
          req.session.user = {};
          req.session.user.username = data.user.username;
          req.session.userId = data.user.id;
        }
        next();
      })
      .catch((err) => {
        models.Sessions.create()
          .then((data) => models.Sessions.get({id: data.insertId}))
          .then((data) => {
            req.session.hash = data.hash;
            res.cookie('shortlyid', data.hash);
            next();
          });
      });
  }
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

