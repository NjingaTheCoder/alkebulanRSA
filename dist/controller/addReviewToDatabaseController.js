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
const review_schema_1 = require("../model/review_schema"); // Adjust the path as per your folder structure
const addReviewToDatabaseController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, userId, rating, review, name, email, verifiedPurchase } = req.body;
        // Validate input
        if (!productId || !userId || !rating || !review) {
            return res.status(400).json({ message: 'Please Signe in to procced' });
        }
        // Create a new review object
        const newReview = new review_schema_1.ReviewModel({
            productId,
            userId,
            rating,
            review,
            name,
            email,
            verifiedPurchase
        });
        // Save the review to the database
        const savedReview = yield newReview.save();
        // Return success response
        return res.status(201).json({
            message: 'Review created successfully',
            review: savedReview
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error saving data:', error.message);
            res.status(500).send({ error: error.message });
        }
        else {
            console.error('Unexpected error:', error);
            res.status(500).send({ error: 'Unexpected error' });
        }
    }
});
exports.default = addReviewToDatabaseController;
