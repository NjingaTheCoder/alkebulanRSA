import { Request , Response } from "express";
import { userModel } from "../model/user_schema";
import mongoose from "mongoose";

const DeleteCustomer = async (req : Request , res : Response) => {

    const {customerId} = req.body;
    
    try {

        const id = new mongoose.Types.ObjectId(customerId);
        const deletedCustomer = await userModel.findByIdAndDelete({customerId : id});

        if (!deletedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer deleted successfully', deletedCustomer });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete customer' });
    }
}

export default DeleteCustomer;
