// Init all modular routes
import userRouter from "./user.js";
import blogRouter from './blog.js'

export default function initRoutes(app) {
    app.use('/user', userRouter);
    app.use('/blog', blogRouter);
}