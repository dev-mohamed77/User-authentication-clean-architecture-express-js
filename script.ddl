-- Active: 1668249502786@@127.0.0.1@5432@pixel_store@public


create type rule_enum AS ENUM(
    'ADMIN',
    'USER'
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";



CREATE TABLE users (
    users_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    users_first_name VARCHAR(255),
    users_last_name VARCHAR(255),
    users_username VARCHAR(255) NOT NULL, 
    users_email VARCHAR(255) NOT NULL,
    users_password VARCHAR(300) NOT NULL,
    users_phone VARCHAR(15),
    users_image VARCHAR(300),
    users_rule rule_enum,
    users_created_at TIMESTAMP,
    users_updated_at TIMESTAMP,
    CONSTRAINT "user_pk" PRIMARY KEY (users_id),
    CONSTRAINT "user_username_fk" UNIQUE (users_username),
    CONSTRAINT "user_email_fk" UNIQUE (users_email)
);

ALTER TABLE users ADD COLUMN users_is_active BOOLEAN NOT NULL DEFAULT FALSE;

SELECT * FROM users;

CREATE TABLE country(
    country_id uuid NOT NULL DEFAULT uuid_generate_v4(),
    country_name VARCHAR(155) NOT NULL
);


ALTER TABLE country ADD CONSTRAINT "country_pk" PRIMARY KEY(country_id);


CREATE TABLE address(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    country_id uuid NOT NULL,
    unit_number INT,
    sreet_number INT,
    address_line1 VARCHAR(300),
    address_line2 VARCHAR(300),
    city VARCHAR(155),
    postal_code VARCHAR(155),
    region VARCHAR(155),
    CONSTRAINT "address_pk" PRIMARY KEY (id),
    CONSTRAINT "country_fk" FOREIGN KEY (country_id) REFERENCES "country" (country_id) ON UPDATE CASCADE ON DELETE CASCADE
);


