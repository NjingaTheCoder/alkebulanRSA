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
const GetCheckOutFromDatabaseController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, _csrf } = req.body;
        const orders = yield check_out_schema_1.checkOut.findOne({ userId });
        if (!orders) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }
        return res.status(200).json(orders);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.default = GetCheckOutFromDatabaseController;
