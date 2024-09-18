"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    _id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    customer_id: {
        type: String,
        required: true
    },
    cart: {
        type: cartSchema,
        required: true
    },
    reviews_and_ratings: {
        type: [reviewSchema],
        required: true
    }
});
module.exports = mongoose_1.default.model('User', userSchema);
