import { Request , Response } from "express";
import { userModel } from "../model/user_schema";
import mongoose , {Types} from "mongoose";

const DeleteCustomer = async (req : Request , res : Response) => {

    const {customerId} = req.body;
    
    try {

        console.log(customerId);

        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            throw new Error("Invalid customerId format");
          }
          
          const id = new mongoose.Types.ObjectId(customerId); // Use `new` with a string
          const deletedCustomer = await userModel.findByIdAndDelete(id);

        if (!deletedCustomer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer deleted successfully', deletedCustomer });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete customer' });
    }
}

export default DeleteCustomer;
