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
const GetCustomers = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield user_schema_1.userModel.find();
        response.status(200).json({ customers: customers });
    }
    catch (err) {
        response.status(500).json({ error: 'Failed to fetch customers' });
    }
});
exports.default = GetCustomers;
