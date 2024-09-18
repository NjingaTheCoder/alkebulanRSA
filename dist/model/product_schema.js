"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bestSellerProductModel = exports.productModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const descriptionSchema = new mongoose_1.default.Schema({
    shortDescription: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
        required: true
    }
});
const sizeAndCapacitySchema = new mongoose_1.default.Schema({
    coverageArea: {
        type: String,
        required: true
    },
    specialFeature: {
        type: String,
        required: true
    }
});
const discountSchema = new mongoose_1.default.Schema({
    discountState: {
        type: Boolean,
        required: true
    },
    discountAmount: {
        type: Number,
        required: true
    }
});
const productShema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    filterOption: {
        type: String,
        required: true
    },
    description: {
        type: descriptionSchema,
        required: true
    },
    features: {
        type: Array,
        required: true,
    },
    ratings: {
        type: Array,
        required: true
    },
    sizeAndCapacity: {
        type: sizeAndCapacitySchema,
        required: true
    },
    images: {
        type: String,
        require: true
    },
    availability: {
        type: Number,
        require: false
    },
    discount: {
        type: discountSchema,
        required: true
    }
});
exports.productModel = mongoose_1.default.model('product', productShema);
exports.bestSellerProductModel = mongoose_1.default.model('best_seller_product', productShema);
