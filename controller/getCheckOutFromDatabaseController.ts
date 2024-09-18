import { Request , Response } from "express";
import { checkOut } from "../model/check_out_schema";

const GetCheckOutFromDatabaseController = async ( req : Request , res : Response) => {

    try {
        const { userId , _csrf } = req.body;
    
        const orders = await checkOut.findOne({ userId });
    
        if (!orders) {
          return res.status(404).json({ message: 'No orders found for this user' });
        }
    
        return res.status(200).json(orders);
      } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
      }
    
}

export default GetCheckOutFromDatabaseController;
