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
const order_schema_1 = require("../model/order_schema");
const mongoose_1 = __importDefault(require("mongoose"));
const DeleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.body;
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(orderId)) {
            throw new Error("Invalid customerId format");
        }
        const id = new mongoose_1.default.Types.ObjectId(orderId); // Use `new` with a string
        const deletedOrder = yield order_schema_1.orderModel.findByIdAndDelete(id);
        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully', deletedOrder });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
});
exports.default = DeleteOrder;
