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
const check_out_schema_1 = require("../model/check_out_schema");
const UpdateCheckOutController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, method, transactionId, status, _id, _csrf } = request.body;
    const checkOutObject = yield check_out_schema_1.checkOut.findOne({ userId: userId });
    const paymentDetails = {
        method: method,
        transactionId: transactionId,
        status: status,
        _id: _id,
    };
    if (checkOutObject) {
        yield checkOutObject.updateOne({ paymentDetails: paymentDetails });
    }
});
exports.default = UpdateCheckOutController;
