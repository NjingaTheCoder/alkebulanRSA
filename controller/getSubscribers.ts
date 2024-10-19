import { Request , Response } from "express";
import Subscription from "../interface&Objects/subscriber_schema";


const GetSubscribers = async ( request : Request , response : Response) => {
    try {
        const subscribers = await Subscription.find();
        response.status(200).json({Subscription : Subscription });
    } catch (err) {
        response.status(500).json({ error: 'Failed to fetch customers' });
    }
}

export default GetSubscribers;
