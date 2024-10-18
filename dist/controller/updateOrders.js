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
const order_schema_1 = require("./../model/order_schema");
const UpdateOrderStatusAndTrackingCode = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { ordersArray } = request.body; // Expecting an array of orders with status and tracking code
    // Validate that we actually received an array
    if (!Array.isArray(ordersArray)) {
        return response.status(400).json({ message: "Invalid input. Expected an array of orders." });
    }
    try {
        const updatePromises = ordersArray.map((order) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Destructure the relevant fields from the request body
                const { id, checkOutObject: { orderStatus }, trackingCode } = order;
                // Update only the orderStatus and trackingCode for the given id
                return yield order_schema_1.orderModel.findOneAndUpdate({ id }, // Query by id (not _id or checkOutObject.id)
                {
                    $set: {
                        "checkOutObject.orderStatus": orderStatus,
                        trackingCode: trackingCode,
                    },
                }, { new: true, runValidators: true });
            }
            catch (error) {
                console.error(`Failed to update order with id ${order.id}:`, error);
                return null; // Handle failure for individual orders
            }
        }));
        const updatedOrders = yield Promise.all(updatePromises);
        response.status(200).json({
            message: "Orders updated successfully",
            data: updatedOrders.filter(Boolean), // Filter out any null results from failed updates
        });
    }
    catch (error) {
        console.error("Error updating orders:", error);
        response.status(500).json({
            message: "Failed to update orders",
            error: error,
        });
    }
});
exports.default = UpdateOrderStatusAndTrackingCode;
