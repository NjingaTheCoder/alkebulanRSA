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
const check_out_schema_1 = require("../model/check_out_schema");
const axios_1 = __importDefault(require("axios"));
const UpdateCheckOutController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, transactionId, _csrf } = request.body;
    try {
        const checkOutObject = yield check_out_schema_1.checkOut.findOne({ userId: userId });
        if (checkOutObject) {
            // Find the document by ID and update the paymentDetails.transactionId field
            const updatedOrder = yield check_out_schema_1.checkOut.findByIdAndUpdate(userId, {
                $set: { 'paymentDetails.transactionId': transactionId } // Use dot notation to target the nested field
            }, { new: true } // Return the updated document
            );
            if (updatedOrder) {
                response.status(200).send({ updatedOrder });
            }
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Axios error:', {
                message: error.message,
                code: error.code,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : null,
            });
        }
        else {
            console.error('Unexpected error:', error);
        }
        response.status(500).json({ message: 'Failed to update transaction Id' });
    }
});
exports.default = UpdateCheckOutController;
