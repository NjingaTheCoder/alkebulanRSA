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
const AddProductToDatabaseController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, currency, category, model, filterOption, shortDescription, longDescription, features, ratings, coverageArea, specialFeature, images, availability, discountState, discountAmount } = request.body;
    const featureArray = features === null || features === void 0 ? void 0 : features.split(',');
    const productObject = {
        name: name,
        price: parseFloat(price),
        currency: currency,
        category: category,
        model: model,
        filterOption: filterOption,
        description: {
            shortDescription: shortDescription,
            longDescription: longDescription,
        },
        features: featureArray,
        ratings: [parseInt(ratings)],
        sizeAndCapacity: {
            coverageArea: coverageArea,
            specialFeature: specialFeature,
        },
        images: images,
        availability: parseInt(availability),
        discount: {
            discountState: discountState,
            discountAmount: discountAmount,
        }
    };
    try {
        const saveProductDetails = new product_schema_1.productModel(productObject);
        saveProductDetails.save();
        response.status(200).send({ message: 'Product successfully saved' });
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
exports.default = AddProductToDatabaseController;
