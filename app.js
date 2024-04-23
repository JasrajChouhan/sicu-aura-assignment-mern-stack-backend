import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


import dotenv from 'dotenv'
dotenv.config();

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true,

}))


/** all nessecery middlwares */
app.use(express.json({limit : "15kb"}))
app.use(express.urlencoded({extended : true ,limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser());



export {app}