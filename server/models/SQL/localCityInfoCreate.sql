-- INSERT INTO users (username, first_name, last_name) VALUES ('user123', 'Bob', 'Smith');
-- INSERT INTO businesses (yelp_id, yelp_obj) VALUES ('JDFKJDFKJosdfuhw98e', '{"key":"value"}');
-- INSERT INTO user_favorite_businesses (yelp_id, user_id) VALUES ('JDFKJDFKJosdfuhw98e', (SELECT _id FROM users WHERE username = 'user123'));

-- SELECT * FROM user_favorite_businesses ufb
-- INNER JOIN users u ON ufb.user_id = u._id 
-- INNER JOIN businesses b ON ufb.yelp_id = b.yelp_id
-- WHERE username = 'user123'

-- DELETE FROM user_favorite_businesses
-- WHERE user_id = (SELECT _id FROM users WHERE username = 'anotheruser')
-- AND yelp_id = 'KVmX9aAWySQGgsW3KGJrgA'

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE TABLE public.users (
	"_id" serial NOT NULL,
	"username" varchar NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
  UNIQUE ("username")
	CONSTRAINT "users_pk" PRIMARY KEY ("_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE  public.businesses (
	"yelp_id" varchar NOT NULL,
	"yelp_obj" jsonb NOT NULL,
	CONSTRAINT "businesses_pk" PRIMARY KEY ("yelp_id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE  public.user_favorite_businesses (
	"_id" serial NOT NULL,
	"user_id" bigint NOT NULL,
	"yelp_id" varchar NOT NULL,
  UNIQUE ("user_id", "yelp_id")
	CONSTRAINT "user_favorite_businesses_pk" PRIMARY KEY ("_id"),
  CONSTRAINT "user_favorite_businesses_fk0" FOREIGN KEY ("user_id") REFERENCES public.users("_id"),
  CONSTRAINT "user_favorite_businesses_fk1" FOREIGN KEY ("yelp_id") REFERENCES public.businesses("yelp_id")
) WITH (
  OIDS=FALSE
);