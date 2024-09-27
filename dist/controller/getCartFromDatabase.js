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
const cart_schema_1 = require("../model/cart_schema");
const mongoose_1 = __importDefault(require("mongoose"));
const GetCartFromDatabase = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const {} = request.body;
    const userId = (_b = (_a = request.session) === null || _a === void 0 ? void 0 : _a.userData) === null || _b === void 0 ? void 0 : _b.userID;
    if (!userId) {
        return response.status(400).json({ message: 'Your are not logged in' });
    }
    try {
        const userIdMongo = new mongoose_1.default.Types.ObjectId(userId);
        const cart = yield cart_schema_1.cartModel.findOne({ userId: userIdMongo });
        if (cart) {
            const cartSize = cart.items;
            return response.status(200).send({ cart: cartSize, cartID: cartSize._id });
        }
        else {
            return response.status(500).json({ message: 'Internal Server Error' });
        }
    }
    catch (error) {
        console.error('Error saving cart:', error);
        return response.status(500).json({ message: 'Internal Server Error' });
    }
});
exports.default = GetCartFromDatabase;
