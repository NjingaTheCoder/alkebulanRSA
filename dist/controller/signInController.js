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
const session_schema_1 = __importDefault(require("../model/session_schema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const cart_schema_1 = require("../model/cart_schema");
const SignInController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
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
        yield session_schema_1.default.findOneAndDelete({ 'session.userData.userEmail': email });
        //object for storing user data
        request.session.userData = {
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
        const guestCart = yield cart_schema_1.cartModel.findOne({ userId: (_b = (_a = request.session) === null || _a === void 0 ? void 0 : _a.guestCart) === null || _b === void 0 ? void 0 : _b.userId });
        const userCart = yield cart_schema_1.cartModel.findOne({ userId: user._id });
        if (userCart && guestCart) {
            // Merge items (you might need to define your own merging logic based on your schema)
            guestCart.items.forEach((item) => {
                const existingItem = userCart.items.find((cartItem) => cartItem.productId.equals(item === null || item === void 0 ? void 0 : item.productId));
                if (existingItem) {
                    existingItem.quantity += item.quantity; // Update quantity
                }
                else {
                    userCart.items.push(item); // Add new item
                }
            });
            yield userCart.save(); // Save updated user cart
        }
        else if (guestCart) {
            guestCart.userId = user._id;
            yield guestCart.save();
        }
        // Clean up guest cart session after merging
        (_d = (_c = request.session) === null || _c === void 0 ? void 0 : _c.guestCart) === null || _d === void 0 ? true : delete _d.userId;
        // Save session and return success
        request.session.save((err) => {
            if (err) {
                console.error('Error saving session:', err);
                return response.status(500).send({ error: 'Session error' });
            }
            console.log('Session data after login:', request.session);
            response.status(200).send({ message: 'Login successful' });
        });
    }
    catch (error) {
        console.error('Error during login:', error);
        response.status(500).send({ error: 'Internal server error' });
    }
});
exports.default = SignInController;
