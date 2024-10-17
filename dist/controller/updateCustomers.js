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
const user_schema_1 = require("../model/user_schema");
const UpdateCustomers = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const customersArray = request.body; // Expecting an array of customer objects in the request body
    // Validate that we actually received an array
    if (!Array.isArray(customersArray)) {
        return response.status(400).json({ message: "Invalid input. Expected an array of customers." });
    }
    try {
        const updatePromises = customersArray.map((customer) => __awaiter(void 0, void 0, void 0, function* () {
            // Ensure each object contains the _id field
            if (!customer._id) {
                throw new Error(`Customer with missing _id: ${JSON.stringify(customer)}`);
            }
            // Update each customer based on _id
            return user_schema_1.userModel.findByIdAndUpdate(customer._id, customer, {
                new: true, // Returns the updated document
                runValidators: true, // Ensures model validation runs
            });
        }));
        // Wait for all updates to complete
        const updatedCustomers = yield Promise.all(updatePromises);
        response.status(200).json({
            message: "Customers updated successfully",
            data: updatedCustomers,
        });
    }
    catch (error) {
        console.error("Error updating customers:", error);
        response.status(500).json({
            message: "Failed to update customers",
            error: error,
        });
    }
});
exports.default = UpdateCustomers;
