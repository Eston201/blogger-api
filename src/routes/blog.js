import express from 'express'
import * as db from '../db/index.js'

const router = express.Router();

/**
 * Blog Create 
*/
router.post('/create', async (req, res) => {
    const { author, title, content, category, commentable, status } = req.body;
    const query = ` INSERT INTO blog
                    (author, title, content, category, status, commentable)
                    VALUES
                    ($1, $2, $3, $4, $5, $6)
                    RETURNING blog_id
                `;
    try {
        const { rows: data} = await db.query(query, [author, title, content, category, status, commentable]);
        const [ returnedObj ] = data;
        const { blog_id } = returnedObj;
        res.status(200).json({ 
            data: {
                blog_id
            }
        });
    } catch (err) {
        res.status(500).json({ error: err });
    }
})

export default router