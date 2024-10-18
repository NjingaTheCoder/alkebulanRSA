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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const order_schema_1 = require("./../model/order_schema");
const UpdateOrders = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { ordersArray } = request.body; // Expecting an array of order objects in the request body
    console.log(ordersArray);
    // Validate that we actually received an array
    if (!Array.isArray(ordersArray)) {
        return response.status(400).json({ message: "Invalid input. Expected an array of orders." });
    }
    try {
        const updatePromises = ordersArray.map((order) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Ensure the id is converted to ObjectId if it's a string
                const id = typeof order.id === 'string' ? new mongoose_1.default.Types.ObjectId(order.id) : order.id;
                // Destructure to exclude id from the update data
                const { id: _ } = order, updateData = __rest(order, ["id"]);
                return order_schema_1.orderModel.findByIdAndUpdate(id, updateData, {
                    new: true, // Returns the updated document
                    runValidators: true, // Ensures model validation runs
                });
            }
            catch (error) {
                console.error(`Failed to update order with id ${order.id}:`, error);
                return null; // Handle failure for individual orders
            }
        }));
        const updatedOrders = yield Promise.all(updatePromises);
        response.status(200).json({
            message: "Orders updated successfully",
            data: updatedOrders.filter(Boolean), // Remove any null results from failed updates
        });
    }
    catch (error) {
        console.error("Error updating orders:", error);
        response.status(500).json({
            message: "Failed to update orders",
            error: error || error,
        });
    }
});
exports.default = UpdateOrders;
