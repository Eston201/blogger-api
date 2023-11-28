// Init all modular routes
import userRouter from "./user.js";

export default function initRoutes(app) {
    app.use('/user', userRouter)
}