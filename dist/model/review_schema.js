"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // Ratings should be between 1 and 5
    },
    review: {
        type: String,
        required: true,
        maxlength: 1000, // Limit the comment to 1000 characters
    },
    name: {
        type: String,
        maxlength: 100, // Optional title for the review, max 100 characters
    },
    email: [
        {
            type: String,
        }
    ],
    verifiedPurchase: {
        type: Boolean,
        default: false, // Indicates if the review is from a verified purchase
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
    updatedAt: {
        type: Date,
        default: Date.now, // Automatically set the updated date
    }
});
// Model export
exports.ReviewModel = mongoose_1.default.model('Review', reviewSchema);
