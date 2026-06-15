import 'dotenv/config';
import express from 'express';
import userRouter from './router/user.router.js';
import cookieParser from 'cookie-parser';
import  mongoose from "mongoose";

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use('/api/v1', userRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const connectDb = async () => {
    try{
       const conn= await mongoose.connect(process.env.MONGO_URI || "");
        console.log(`MongoDB connected: ${conn.connection.host}`)
    }catch (e) {
        console.log(`Error connecting to database: ${e}`);
        process.exit(1);
    }
};

connectDb().then(() => {
    app.listen(process.env.PORT || 3007, () => {
        console.log(`sever is running on ${process.env.PORT}`)
    })
});

