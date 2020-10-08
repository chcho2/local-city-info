const express = require('express');
const oAuthController = require('../controllers/oAuthController');
const userFavoritesController = require('../controllers/userFavoritesController');

const router = express.Router();

router.post('/',
  oAuthController.verifyToken,
  userFavoritesController.addUser,
  (req, res) => (
    res.status(200).json({ authorized: res.locals.isLoggedIn })
  ));

module.exports = router;
