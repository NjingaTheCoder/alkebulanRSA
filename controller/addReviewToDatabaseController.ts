import { Request, Response } from 'express';
import { ReviewModel } from '../model/review_schema';// Adjust the path as per your folder structure

const addReviewToDatabaseController = async (req: Request, res: Response) => {
    try {
        const { productId, userId, rating, review, name, email, verifiedPurchase } = req.body;

        // Validate input
        if (!productId || !userId || !rating || !review) {
            return res.status(400).json({ message: 'Please Signe in to procced' });
        }

        // Create a new review object
        const newReview = new ReviewModel({
            productId,
            userId,
            rating,
            review,
            name,
            email,
            verifiedPurchase
        });

        // Save the review to the database
        const savedReview = await newReview.save();

        // Return success response
        return res.status(201).json({
            message: 'Review created successfully',
            review: savedReview
        });
    } catch (error) {
        if (error instanceof Error) {

            console.error('Error saving data:', error.message);
            res.status(500).send({ error: error.message });
          } else {

            console.error('Unexpected error:', error);
            res.status(500).send({ error: 'Unexpected error' });
          }
    }
};

 export default addReviewToDatabaseController;
