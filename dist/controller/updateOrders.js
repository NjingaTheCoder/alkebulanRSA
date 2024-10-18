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
const mongoose_1 = __importDefault(require("mongoose"));
const order_schema_1 = require("./../model/order_schema");
const UpdateOrders = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { ordersArray } = request.body; // Expecting an array of orders in the request body
    // Validate that we received an array
    if (!Array.isArray(ordersArray)) {
        return response.status(400).json({ message: "Invalid input. Expected an array of orders." });
    }
    try {
        const updatePromises = ordersArray.map((order) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Check if the order has a valid id
                if (!order.id) {
                    throw new Error("Order ID is missing");
                }
                // Convert id to ObjectId if it's a string
                const id = typeof order.id === 'string' ? new mongoose_1.default.Types.ObjectId(order.id) : order.id;
                // Only update the `orderStatus` and `trackingCode` fields
                const updateData = {
                    'checkOutObject.orderStatus': order.orderStatus,
                    trackingCode: order.trackingCode
                };
                return yield order_schema_1.orderModel.findByIdAndUpdate(id, updateData, {
                    new: true, // Return the updated document
                    runValidators: true, // Ensures model validation runs
                });
            }
            catch (error) {
                console.error(`Failed to update order with id ${order.id || 'unknown'}:`, error || error);
                return null; // Handle failure for individual orders
            }
        }));
        // Wait for all update promises to resolve
        const updatedOrders = yield Promise.all(updatePromises);
        // Filter out any null results
        const successfulUpdates = updatedOrders.filter(Boolean);
        if (successfulUpdates.length === 0) {
            return response.status(500).json({ message: "No orders were updated successfully." });
        }
        // Respond with the successfully updated orders
        return response.status(200).json({
            message: "Orders updated successfully",
            data: successfulUpdates,
        });
    }
    catch (error) {
        console.error("Error updating orders:", error);
        return response.status(500).json({
            message: "Failed to update orders due to a server error.",
            error: error || error,
        });
    }
});
exports.default = UpdateOrders;
