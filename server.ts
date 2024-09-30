import dotenv from 'dotenv';
dotenv.config();

import { connectionString, connectToDatabase } from './config/db_connect';
import express, { urlencoded, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import mongoSession from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import router from './route/routes';

const PORT = process.env.PORT || 3000; // Default to port 3000 if not set
const yocoPaymentWebHook = process.env.YOCO_PAYMENT_WEBHOOK;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Create express app
const app = express();

// MongoDB session store initialization
const MongoDBStore = mongoSession(session);
const store = new MongoDBStore({
    uri: connectionString,
    databaseName: 'Alkebulan',
    collection: 'alkebulan_sessions',
});

// Apply session middleware
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SECRET || 'fallbacksecret', // Fallback secret
    store: store,
    cookie: {
        httpOnly: true, // Ensure cookies are only sent via HTTP(S)
        secure: NODE_ENV === 'production', // Secure cookie for HTTPS in production
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: NODE_ENV === 'production' ? 'strict' : 'lax', // Cookie restrictions based on environment
    }
}));

// CORS options
const corsOptions = {
    origin: 'https://shop.alkebulanrsa.co.za', // Allow only your production URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Enable credentials (cookies, authorization headers)
};

// Apply middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
app.use(express.json());



// Rate limiting for Yoco payment webhook
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});

// Apply rate limit middleware to the webhook route
app.use(`${yocoPaymentWebHook}/create`, limiter);

// Custom middleware to add additional headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// Apply routes to the express app
app.use('/', router);

//================================
// Check if database is connected then run the server on a port.
//================================
const checkDatabaseConnection = async () => {
    try {
        if (await connectToDatabase()) {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        } else {
            console.error('Database connection failed');
        }
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

checkDatabaseConnection();

//================================
// Middleware for catching CSRF attacks
//================================
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.code !== 'EBADCSRFTOKEN') {
        return next(err);
    }
    res.status(403).send('Error: CSRF Attack Detected 🙊');
});
