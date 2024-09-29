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
const user_schema_1 = require("../model/user_schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const SignInController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, _csrf } = request.body;
    try {
        const user = yield user_schema_1.userModel.findOne({ email_address: email });
        if (!user) {
            return response.status(401).send({ error: 'Invalid email or password' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return response.status(401).send({ error: 'Invalid email or password' });
        }
        //object for storing user data
        const userData = {
            isAuthenticated: true,
            forgotPassword: false,
            userID: user._id,
            userEmail: user.email_address,
            userName: user.name,
            userSurname: user.surname,
            userPhoneNumber: user.phone_number,
            csrfToken: _csrf
        };
        // Get current date
        const currentDate = new Date();
        const last_logged_date = currentDate.toISOString();
        //update last loggin date
        yield user.updateOne({ last_logged_in: last_logged_date });
        request.session.userData = userData;
        response.status(200).send({ message: 'Login successful' });
    }
    catch (error) {
        console.error('Error during login:', error);
        response.status(500).send({ error: 'Internal server error' });
    }
});
exports.default = SignInController;
