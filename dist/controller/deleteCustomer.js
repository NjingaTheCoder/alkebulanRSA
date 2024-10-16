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
const DeleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.body;
    try {
        const id = customerId;
        const deletedCustomer = yield user_schema_1.userModel.findByIdAndDelete({ customerId: id });
        if (!deletedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully', deletedCustomer });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete customer' });
    }
});
exports.default = DeleteCustomer;
