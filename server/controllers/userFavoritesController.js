/* eslint-disable */
const db = require('../models/localCityInfoModel');

const userFavoritesController = {};

userFavoritesController.addUser = (req, res, next) => {
  const { username, firstName, lastName } = res.locals;

  const query = `
    INSERT INTO users (username, first_name, last_name) 
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING;
  `;

  db.query(query, [username, firstName, lastName])
    .then(() => next())
    .catch((err) => next(err));
};

userFavoritesController.getFavorites = async (req, res, next) => {
  const { username } = res.locals;

  const query = `
    SELECT yelp_obj FROM user_favorite_businesses ufb
      INNER JOIN users u ON ufb.user_id = u._id 
      INNER JOIN businesses b ON ufb.yelp_id = b.yelp_id
      WHERE username = $1;
  `;
  
  try {
    const dbResponse = await db.query(query, [username]);
    res.locals.favoriteBusinesses = dbResponse.rows.map((el) => el.yelp_obj);
    return next();
  } catch (err) {
    return next(err);
  }
}

userFavoritesController.setFavorite = async (req, res, next) => {
  const { business } = req.body;
  const { id: yelp_id } = business;
  const { username } = res.locals;

  // on conflict do nothing stops error from being thrown by postgres when duplicate entry
  const queryInsertBusiness = `
    INSERT INTO businesses (yelp_id, yelp_obj) 
      VALUES ($1, $2) 
      ON CONFLICT DO NOTHING;
  `;
  const queryInsertfavTable = `
    INSERT INTO user_favorite_businesses (yelp_id, user_id) 
      VALUES ($1, (SELECT _id FROM users WHERE username = $2))
      ON CONFLICT DO NOTHING;
  `;

  try {
    await db.query(queryInsertBusiness, [yelp_id, business]);
    await db.query(queryInsertfavTable, [yelp_id, username]);
    return next();
  } catch (err) {
    console.log(err);
    return next(err);
  }
};

userFavoritesController.deleteFavorite= async (req, res, next) => {
  const { business } = req.body;
  const { id: yelp_id } = business;
  const { username } = res.locals;

  const queryDeleteUserFav = `
    DELETE FROM user_favorite_businesses
      WHERE user_id = (SELECT _id FROM users WHERE username = $1)
      AND yelp_id = $2
  `;

  const queryDeleteOrphanedBusinesses = `
    DELETE 
      FROM businesses b
      WHERE NOT EXISTS
        (SELECT 1
        FROM user_favorite_businesses ufb
        WHERE ufb.yelp_id = b.yelp_id
        );
  `;

  try {
    await db.query(queryDeleteUserFav, [username, yelp_id]);
    await db.query(queryDeleteOrphanedBusinesses);
    return next();
  } catch (err) {
    console.log(err);
    return next(err);
  }
}



module.exports = userFavoritesController;
