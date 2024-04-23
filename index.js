import { app } from "./app.js";
import connectDB from "./db/databaseConnection.js";
import {ErrorMiddleware} from './middlewares/errorHandler.js'
import authRouter from "./routes/user.route.js"


import dotenv from 'dotenv'
dotenv.config();


const port = process.env.PORT || 5000 ;
connectDB()

/* ------------------------------ All App Route ----------------------------- */

app.use('/api/v1/user/auth' , authRouter)

app.use(ErrorMiddleware)




/* ---------------------------- Server listen ---------------------------- */
app.listen(port , () => {
    console.log(`Server started on ${port}`);
})