# BLOGGER-API
The backend for the blogger app.

## Run Server
### Prerequisite
* You have created a .env file in the root folder that include the following keys with your specific values
    * DB_PASSWORD="your_db_password"
    * HASH_ROUNDS="your_preferred_hash_rounds"
* You have Postgresql server running locally with the following tables created:
    * users
        ~~~~sql
            CREATE EXTENSION IF NOT EXISTS pgcrypto;

            DROP TABLE IF EXISTS "user";
            CREATE TABLE "user" (
                username VARCHAR(20) NOT NULL PRIMARY KEY,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ~~~~
    * user_info
        ~~~~sql
            CREATE TABLE user_info (
                id SERIAL PRIMARY KEY,
                username VARCHAR(20) REFERENCES user(username),
                name VARCHAR(25),
                bio TEXT
            );
        ~~~~
    * blog 
        ~~~~sql
            CREATE TABLE blog (
                blog_id SERIAL PRIMARY KEY,
                author VARCHAR(20) REFERENCES "user"(username),
                title VARCHAR(30) NOT NULL,
                content TEXT NOT NULL,
                category VARCHAR(25) NOT NULL,
                publish_date TIMESTAMP,
                status VARCHAR(20) NOT NULL,
                commentable BOOL DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ~~~~

* run `npm i` to install all dependencies
* run `node src/index.js` to start the server, or if you have nodemon installed, `nodemon src/index.js`
