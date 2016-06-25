drop table IF EXISTS allocations;
drop table IF EXISTS users;
drop table IF EXISTS assets;

CREATE TABLE IF NOT EXISTS users(
  user_id serial primary key,
  first_name varchar(255) not null,
  last_name varchar(255) not null,
  email varchar(255) unique not null 
);

CREATE TABLE IF NOT EXISTS assets(
  asset_id serial primary key,
  type varchar(255) not null,
  attributes json not null
);

CREATE TABLE IF NOT EXISTS allocations(
  allocation_id serial primary key,
  user_id integer references users(user_id),
  asset_id integer references assets(asset_id),
  start date,
  finish date
);

