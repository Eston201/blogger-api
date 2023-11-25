import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser';
import pg from 'pg'

const pool = new pg.Pool({
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    database: 'blogger',
    host: 'localhost',
    port: '5432'
})

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const port = 3000;

/**
 * Auth Routes
*/
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT username
                   FROM "user"
                   WHERE username = $1
                   AND password = crypt($2, password)
                `;
    try {
        const { rows: data } = await pool.query(query, [username, password]);
        const userExists = (data.length === 1) ? true : false;
        res.status(200).json({ data: userExists });
    } catch(err) {
        res.status(500).json({ error: err });
    }
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const query1 = ` INSERT INTO "user" 
                    (username, password) 
                    VALUES 
                    ($1, crypt($2, gen_salt('bf', ${process.env.HASH_ROUNDS})))
                `;
    const query2 = ` INSERT INTO 
                    user_info (username, name, bio)
                    VALUES
                    ($1, $2, '')
                `;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query(query1, [username, password]); // create the user in the database
        await client.query(query2, [username, username]); // insert default values in the user_info table
        await client.query('COMMIT');
        res.status(200).json({ data: true});
    } catch(err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err });
    } finally {
        client.release();
    }
})

app.post('/checkUniqueUsername', async (req, res) => {
    const { username } = req.body;
    const query = `SELECT username
                   FROM "user"
                   WHERE username = $1
                `;
    try {
        const { rows: data } = await pool.query(query, [username]);
        const usernameIsUnique = (data.length === 0) ? true : false;
        res.status(200).json({ data: usernameIsUnique });
    } catch(err) {
        res.status(500).json({ error: err });
    }
})

/**
 * 
*/

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

export { app }
