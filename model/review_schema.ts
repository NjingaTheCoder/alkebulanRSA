import Mongoose, { Schema } from "mongoose";

const reviewSchema = new Mongoose.Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
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
export const ReviewModel = Mongoose.model('Review', reviewSchema);
