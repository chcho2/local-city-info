const { Pool } = require('pg');
require('dotenv').config();

const PG_URI = process.env.POSTGRES_URI;

const pool = new Pool({
  connectionString: PG_URI,
});

// schema can be found in models/SQL/localCityInfoCreate.sql

module.exports = {
  query: (text, params, callback) => {
    // console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};
