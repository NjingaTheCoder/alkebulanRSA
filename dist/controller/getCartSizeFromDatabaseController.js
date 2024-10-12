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
const GetCartSizeFromDatabaseController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { userId } = request.body;
    try {
        let userIdMongo = userId;
        if ((_b = (_a = request.session) === null || _a === void 0 ? void 0 : _a.guestCart) === null || _b === void 0 ? void 0 : _b.userId) {
            userIdMongo = (_d = (_c = request.session) === null || _c === void 0 ? void 0 : _c.guestCart) === null || _d === void 0 ? void 0 : _d.userId;
        }
        const cart = yield cart_schema_1.cartModel.findOne({ userId: userIdMongo });
        if (cart) {
            let totalCount = 0;
            cart.items.map((item, index) => {
                totalCount = totalCount + item.quantity;
            });
            const cartSize = totalCount;
            console.log(cartSize);
            return response.status(200).send({ cartSize: cartSize });
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
exports.default = GetCartSizeFromDatabaseController;
