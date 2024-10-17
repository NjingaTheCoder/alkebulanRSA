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
const GetAllOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the order where 'checkOutObject.orderId' matches the passed orderId
        const order = yield order_schema_1.orderModel.find();
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
exports.default = GetAllOrder;
