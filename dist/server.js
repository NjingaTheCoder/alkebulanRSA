"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_connect_1 = require("./config/db_connect");
const express_1 = __importStar(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongodb_session_1 = __importDefault(require("connect-mongodb-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = __importDefault(require("./route/routes"));
const PORT = process.env.PORT;
const yocoPaymentWebHook = process.env.YOCO_PAYMENT_WEBHOOK;
//create express app
const app = (0, express_1.default)();
//create mongo store
const mongoStore = (0, connect_mongodb_session_1.default)(express_session_1.default);
const store = new mongoStore({
    uri: db_connect_1.connectionString,
    databaseName: 'Alkebulan',
    collection: "alkebulan_sessions",
});
//middleware 
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use((0, express_1.urlencoded)({ extended: true }));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    saveUninitialized: false,
    resave: false,
    secret: process.env.SECRET || '',
    store: store,
    cookie: {
        httpOnly: false, // Set to false to allow JavaScript access
        secure: true, // True if in production and using HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    }
}));
const limiter = (0, express_rate_limit_1.default)({
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
//================================//check if database is connected the run the server on an port.=======================================
const checkDatabaseConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    if (yield (0, db_connect_1.connectToDatabase)()) {
        app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`server rocking on port ${PORT}`);
        }));
    }
    else {
        express_1.response.status(200).send({ message: 'Database connection failed' });
    }
});
checkDatabaseConnection();
//add routes to the express app
app.use(`/`, routes_1.default);
//================================//middleware for catching a csrf attack=======================================
app.use((err, request, response, next) => {
    if (err.code !== "EBADCSRFTOKEN") {
        return next(err);
    }
    response.status(400).send("Error : CSRF Attack Motherfucker🙊");
});
