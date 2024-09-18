import {connectionString , connectToDatabase} from './config/db_connect';
import express, { request, urlencoded , Request , Response , NextFunction, response } from 'express';
import session from 'express-session';
import mongoSession from  'connect-mongodb-session';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//config dotenv
dotenv.config();

//import of routes
import router from './route/routes';



const PORT = 3007;





//create express app
const app = express();


//create mongo store
const mongoStore = mongoSession(session);

const store  = new mongoStore({
    uri: connectionString,
    databaseName: 'Scentor',
    collection : "scentor_sessions",
});

//middleware 
app.use(cookieParser());

app.use(cors({
    origin: 'https://alkebulanyabatho.onrender.com', // Allow only trusted origins
    credentials: true, // Allow credentials to be sent over CORS
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
        secure: true, // True if in production and using HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 
        sameSite:  process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    }
}));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    // other headers
    next();
});


//================================//check if database is connected the run the server on an port.=======================================
const checkDatabaseConnection = async () => {
    if(await connectToDatabase()){
        app.listen(PORT , async () => {
            console.log(`server rocking on port ${PORT}`)
        })
    }else{
        response.status(200).send({ message: 'Database connection failed' });
    }
}

checkDatabaseConnection();

//add routes to the express app
app.use(`/` , router);


  //================================//middleware for catching a csrf attack=======================================
app.use((err : any , request : Request , response : Response , next : NextFunction) => {

    if(err.code !== "EBADCSRFTOKEN"){
        return next(err);
    }
    response.status(400).send("Error : CSRF Attack Motherfucker🙊")
})


