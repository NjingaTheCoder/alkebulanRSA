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
Object.defineProperty(exports, "__esModule", { value: true });
const cart_schema_1 = require("../model/cart_schema");
const AddCartToDatabaseController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, items, _csrf } = request.body;
        // Validate request body
        if (!userId || !items || items.length === 0) {
            return response.status(400).json({ message: 'User ID and cart items are required.' });
        }
        const userExist = yield cart_schema_1.cartModel.findOne({ userId: userId });
        const cartArray = items;
        // Calculate total price
        const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
        const userInfo = userId;
        if (userExist) {
            let upatedTotalPrice = 0;
            userExist.items.map((item, index) => {
                upatedTotalPrice = upatedTotalPrice + (item.price * item.quantity);
            });
            upatedTotalPrice = upatedTotalPrice + (cartArray[0].price * cartArray[0].quantity);
            const newCartArray = [...cartArray, ...userExist.items];
            const updateCart = yield userExist.updateOne({ items: newCartArray });
            yield userExist.updateOne({ totalPrice: upatedTotalPrice });
            yield userExist.updateOne({ updatedAt: new Date() });
        }
        else {
            // Create a new cart document
            const cart = new cart_schema_1.cartModel({
                userId: userInfo,
                items: cartArray,
                totalPrice,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            // Save the cart to the database
            yield cart.save();
        }
        // Respond with the saved cart data
        return response.status(201).json({ message: 'Cart saved successfully' });
    }
    catch (error) {
        console.error('Error saving cart:', error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.default = AddCartToDatabaseController;
