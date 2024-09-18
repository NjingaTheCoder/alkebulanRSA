import mongoose from "mongoose";


export interface IReview {
    productId: mongoose.Schema.Types.ObjectId; // References ObjectId from 'Product' model
    userId: mongoose.Schema.Types.ObjectId;    // References ObjectId from 'User' model
    rating: number;    // Number between 1 and 5
    review: string;    // Max length of 1000 characters
    name?: string;     // Optional, max length of 100 characters
    email: string;   // Array of strings for emails
    verifiedPurchase: boolean; // Indicates if the review is from a verified purchase
    createdAt: Date;   // Date of creation
    updatedAt: Date;   // Date of the last update
}
