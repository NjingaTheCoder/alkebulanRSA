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
const product_schema_1 = require("../model/product_schema");
const GetOneProductFromDatabaseController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { model } = request.body;
    const csrfToken = (_b = (_a = request.session) === null || _a === void 0 ? void 0 : _a.userData) === null || _b === void 0 ? void 0 : _b.csrfToken;
    if (!csrfToken) {
        return response.status(400).json({ message: `Oops! It looks like you're not signed in. Please sign in to proceed.` });
    }
    try {
        const requestedProduct = yield product_schema_1.productModel.findOne({ model: model });
        response.status(200).send({ model: requestedProduct });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error saving data:', error.message);
            response.status(500).send({ error: error.message });
        }
        else {
            console.error('Unexpected error:', error);
            response.status(500).send({ error: 'Unexpected error' });
        }
    }
});
exports.default = GetOneProductFromDatabaseController;
