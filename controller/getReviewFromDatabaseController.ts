import { Request, Response } from "express";
import { IReview } from "../interface&Objects/IOReview";
import { ReviewModel } from "../model/review_schema";

const GetReviewFromDatabaseController = async (request : Request , response : Response) => {
   
    const reviewObject : IReview[] = await ReviewModel.find();
    
    if ( reviewObject){
        return response.status(200).send({ reviewObject  :  reviewObject });
    } else {
        return response.status(401).send({ message: 'No reviews found' });
    }
}

export default GetReviewFromDatabaseController;
