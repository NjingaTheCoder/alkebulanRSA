import dotenv from 'dotenv';
dotenv.config();

import {connectionString , connectToDatabase} from './config/db_connect';
import express, { request, urlencoded , Request , Response , NextFunction, response } from 'express';
import session from 'express-session';
import mongoSession from  'connect-mongodb-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import router from './route/routes';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { initializeSocket } from './controller/socketController';



const PORT = process.env.PORT;
const yocoPaymentWebHook  = process.env.YOCO_PAYMENT_WEBHOOK;


//create express app
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173", // Update to your React frontend's origin
    methods: ["GET", "POST"],
    credentials: true 
  }
});


//create mongo store
const mongoStore = mongoSession(session);

const store  = new mongoStore({
    uri: connectionString,
    databaseName: 'Scentor',
    collection : "scentor_sessions",
});

//middleware 
app.use(cookieParser());

// Use CORS middleware to handle CORS issues
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend origin
    methods: ['GET', 'POST'], // Allow specific methods
    credentials: true // Allow cookies and authentication headers
  }));

app.use(urlencoded({extended:true}));

app.use(express.json());

app.use(session({
    saveUninitialized:false,
    resave:false,
    secret: process.env.SECRET || '',
    store : store,
    cookie: {
        httpOnly: true, // Set to false to allow JavaScript access
        secure: false, // True if in production and using HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 
        sameSite:  process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    }
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  });
  
  // Apply the rate limit to your route
  app.use(`${yocoPaymentWebHook}/create`, limiter);


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    // other headers
    next();
});


//add routes to the express app
app.use(`/` , router);
initializeSocket(io);


//================================//check if database is connected the run the server on an port.=======================================
const checkDatabaseConnection = async () => {
    if(await connectToDatabase()){
        server.listen(PORT , async () => {
            console.log(`server rocking on port ${PORT}`)
        })
    }else{
        response.status(200).send({ message: 'Database connection failed' });
    }
}

checkDatabaseConnection();




  //================================//middleware for catching a csrf attack=======================================
app.use((err : any , request : Request , response : Response , next : NextFunction) => {

    if(err.code !== "EBADCSRFTOKEN"){
        return next(err);
    }
    response.status(400).send("Error : CSRF Attack Motherfucker🙊")
})


