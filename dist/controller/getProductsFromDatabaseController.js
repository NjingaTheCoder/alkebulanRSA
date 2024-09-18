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
const GetProductsFromDatabaseController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const productObject = yield product_schema_1.productModel.find();
    if (productObject) {
        return response.status(200).send({ productObject: productObject });
    }
    else {
        return response.status(401).send({ message: 'No products found' });
    }
});
exports.default = GetProductsFromDatabaseController;
