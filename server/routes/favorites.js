const express = require('express');
const userFavoritesController = require('../controllers/userFavoritesController');

const router = express.Router();

// router.post('/addUser',
//   userFavoritesController.testUser,
//   userFavoritesController.addUser,
//   (req, res) => {
//     res.sendStatus(200);
//   });

router.get('/',
  // userFavoritesController.testUser,
  userFavoritesController.getFavorites,
  (req, res) => {
    return res.status(200).json(res.locals.favoriteBusinesses);
  },
);

router.post('/',
  // userFavoritesController.testUser,
  userFavoritesController.setFavorite,
  (req, res) => {
    res.sendStatus(200);
  });

router.delete('/',
  // userFavoritesController.testUser,
  userFavoritesController.deleteFavorite,
  (req, res) => {
    res.sendStatus(200);
  });

module.exports = router;
