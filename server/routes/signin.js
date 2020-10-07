const express = require('express');
const oAuthController = require('../controllers/oAuthController');
const cookieController = require('../controllers/cookieController');
const router = express.Router();

router.post('/',
oAuthController.verifyToken,
cookieController.setCookie,
  (req, res) => {
    
    res.status(200).json({authorized: res.locals.oAuth});
  });

module.exports = router;