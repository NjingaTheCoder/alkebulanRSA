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
const DeleteCartItemFromDatabaseController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId, productId } = request.body;
    const isAuth = ((_a = request.session.userData) === null || _a === void 0 ? void 0 : _a.isAuthenticated) || false;
    if (isAuth) {
        try {
            const cartObject = yield cart_schema_1.cartModel.findOne({ userId: userId });
            if (cartObject) {
                // Find the index of the address to remove
                const cartIndex = cartObject.items.findIndex((item) => item._id.toString() === productId);
                if (cartIndex !== -1) {
                    // Remove the address from the array
                    cartObject.items.splice(cartIndex, 1);
                    // Save the updated address list back to the database
                    const newCartArray = yield cartObject.save();
                    return response.status(200).send({
                        message: 'Item deleted successfully',
                        cart: cartObject.items
                    });
                }
                else {
                    return response.status(404).send({ message: 'Item not found' });
                }
            }
            else {
                return response.status(404).send({ message: 'User has no cart items' });
            }
        }
        catch (error) {
            console.error('Error deleting address:', error);
            return response.status(500).send({ message: 'An error occurred while deleting the item' });
        }
    }
    else {
        return response.status(401).send({ message: 'User is not authenticated' });
    }
});
exports.default = DeleteCartItemFromDatabaseController;
