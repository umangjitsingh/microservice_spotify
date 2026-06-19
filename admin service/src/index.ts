import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cookieParser from 'cookie-parser';
import { PrismaClient } from "./generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import router from "./routes.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
export const prisma = new PrismaClient({ adapter });
const app=express()

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1', router);

const PORT=process.env.PORT||7071


 app .listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
});