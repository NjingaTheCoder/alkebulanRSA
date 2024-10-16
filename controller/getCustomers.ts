import { Request , Response } from "express";
import { userModel } from '../model/user_schema';


const GetCustomers = async ( request : Request , response : Response) => {
    try {
        const customers = await userModel.find();
        response.status(200).json({customers : customers });
    } catch (err) {
        response.status(500).json({ error: 'Failed to fetch customers' });
    }
}

export default GetCustomers;
