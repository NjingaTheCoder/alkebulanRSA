"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    products_in_the_cart: {
        type: Array,
        required: true
    },
    quantities: {
        type: Array,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    }
});
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true,
        unique: true
    },
    phone_number: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    account_creation_date: {
        type: String,
        required: true
    },
    last_logged_in: {
        type: String,
        require: true
    },
    cart: {
        type: cartSchema,
        require: false
    }
});
exports.userModel = mongoose_1.default.model('customer', userSchema);
