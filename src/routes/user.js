import express from 'express'
import * as db from '../db/index.js'

const router = express.Router();

router.post('/validateUniqueUsername', async (req, res) => {
    const { username } = req.body;
    const query = `SELECT username
                   FROM "user"
                   WHERE username = $1
                `;
    try {
        const { rows: data } = await db.query(query, [username]);
        const usernameIsUnique = (data.length === 0) ? true : false;
        res.status(200).json({ data: usernameIsUnique });
    } catch(err) {
        res.status(500).json({ error: err });
    }
});

/**
 * Auth Routes
*/
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT username
                   FROM "user"
                   WHERE username = $1
                   AND password = crypt($2, password)
                `;
    try {
        const { rows: data } = await db.query(query, [username, password]);
        const userExists = (data.length === 1) ? true : false;
        res.status(200).json({ data: userExists });
    } catch(err) {
        res.status(500).json({ error: err });
    }
});

router.post('/signup', async (req, res) => {
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
    const client = await db.getClient();
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
});

export default router;