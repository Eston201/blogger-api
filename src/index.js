import 'dotenv/config'
import express from 'express'
import initRoutes from './routes/index.js';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
// Set up app middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// init all routes
initRoutes(app);

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
