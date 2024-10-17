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
const user_schema_1 = require("../model/user_schema");
const mongoose_1 = __importDefault(require("mongoose"));
const UpdateCustomers = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { customersArray } = request.body; // Expecting an array of customer objects in the request body
    // Validate that we actually received an array
    if (!Array.isArray(customersArray)) {
        return response.status(400).json({ message: "Invalid input. Expected an array of customers." });
    }
    try {
        const updatePromises = customersArray.map((customer) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Ensure the _id is converted to ObjectId
                const id = new mongoose_1.default.Types.ObjectId(customer._id);
                // Destructure to exclude _id, account_creation_date, and last_logged_in
                const { account_creation_date, last_logged_in, _id } = customer, updateData = __rest(customer, ["account_creation_date", "last_logged_in", "_id"]);
                return user_schema_1.userModel.findByIdAndUpdate(id, updateData, {
                    new: true, // Returns the updated document
                    runValidators: true, // Ensures model validation runs
                });
            }
            catch (error) {
                console.error(`Failed to update customer with _id ${customer._id}:`, error);
                return null; // Handle failure for individual customers
            }
        }));
        const updatedCustomers = yield Promise.all(updatePromises);
        response.status(200).json({
            message: "Customers updated successfully",
            data: updatedCustomers.filter(Boolean), // Remove any null results from failed updates
        });
    }
    catch (error) {
        console.error("Error updating customers:", error || error);
        response.status(500).json({
            message: "Failed to update customers",
            error: error || error,
        });
    }
});
exports.default = UpdateCustomers;
