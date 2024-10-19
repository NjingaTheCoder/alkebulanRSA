import { Request, Response } from "express";
import { ReviewModel } from "../model/review_schema";

const DeleteReview = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        // Find and delete the review where the email matches the one in the email array
        const deletedReview = await ReviewModel.findOneAndDelete({ email: { $in: [email] } });

        if (!deletedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.status(200).json({ message: 'Review deleted successfully', deletedReview });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete review' });
    }
};

export default DeleteReview;
