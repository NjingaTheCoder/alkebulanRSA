"use strict";
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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_schema_1 = require("../model/user_schema");
//================================function for handling signing up=======================================
//==================================================================================================
const SignUpController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // Destructure the body
    const { name, surname, email, phoneNumber, gender, password, _csrf } = request.body;
    console.log(request.body);
    // Validate required fields
    if (!name || !surname || !email || !phoneNumber || !gender || !password) {
        return response.status(400).send({ error: 'All fields are required' });
    }
    // Hash password using bcrypt
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    // Get current date
    const currentDate = new Date();
    const account_creation_date = currentDate.toISOString();
    const last_logged_in = account_creation_date;
    try {
        // Create a model for saving data to MongoDB
        const user = new user_schema_1.userModel({
            name,
            surname,
            gender,
            email_address: email,
            phone_number: phoneNumber,
            password: hashedPassword,
            account_creation_date,
            last_logged_in,
        });
        // Save data into a database
        yield user.save();
        console.log('Data saved into database');
        response.status(200).send({ message: 'User saved into the database' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error saving data:', error.message);
            response.status(500).send({ error: error.message });
        }
        else {
            console.error('Unexpected error:', error);
            response.status(500).send({ error: 'Unexpected error' });
        }
    }
});
exports.default = SignUpController;
