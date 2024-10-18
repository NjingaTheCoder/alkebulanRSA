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
const order_schema_1 = require("../model/order_schema");
const DeleteOrderIdByValue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.body; // The value of the ID you're targeting
    try {
        // Find the document where `id` matches the provided value and unset `id`
        const updatedOrder = yield order_schema_1.orderModel.findOneAndUpdate({ id: orderId }, // Search for the document where `id` matches `idValue`
        {
            $unset: { id: 1 } // Remove the `id` field
        }, { new: true } // Return the updated document after the field has been removed
        );
        if (!updatedOrder) {
            return res.status(404).json({ error: 'Order not found with the provided id' });
        }
        res.status(200).json({ message: 'id field deleted successfully', updatedOrder });
    }
    catch (err) {
        console.error('Error deleting id:', err);
        res.status(500).json({ error: 'Failed to delete id' });
    }
});
exports.default = DeleteOrderIdByValue;
