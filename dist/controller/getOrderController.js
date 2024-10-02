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
const order_schema_1 = require("../model/order_schema"); // Import your order model
const GetOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const {} = req.body; // Get the orderId from the request parameters
    const userId = (_b = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userData) === null || _b === void 0 ? void 0 : _b.userID;
    if (!userId) {
        res.status(400).send({ message: 'User not found😪' });
    }
    try {
        // Find the order where 'checkOutObject.orderId' matches the passed orderId
        const order = yield order_schema_1.orderModel.find({ 'checkOutObject.userId': userId }).exec();
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json(order);
    }
    catch (error) {
        console.error(`Error fetching order: ${error}`);
        return res.status(500).json({ message: 'Error fetching order' });
    }
});
exports.default = GetOrderController;
