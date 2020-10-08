const express = require('express');
const oAuthController = require('../controllers/oAuthController');
const userFavoritesController = require('../controllers/userFavoritesController');

const router = express.Router();

router.get('/',
  oAuthController.verifyToken,
  userFavoritesController.getFavorites,
  (req, res) => {
    const { isLoggedIn, favorites } = res.locals;
    return res.status(200).json({ isLoggedIn, favorites });
  });

router.post('/',
  oAuthController.verifyToken,
  userFavoritesController.setFavorite,
  (req, res) => {
    const { isLoggedIn } = res.locals;
    return res.status(200).json({ isLoggedIn });
  });

router.delete('/',
  oAuthController.verifyToken,
  userFavoritesController.deleteFavorite,
  (req, res) => {
    const { isLoggedIn } = res.locals;
    return res.status(200).json({ isLoggedIn });
  });

module.exports = router;
