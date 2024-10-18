import { Request , Response } from "express";
import { orderModel } from "../model/order_schema";
import mongoose , {Types} from "mongoose";

const DeleteOrder = async (req : Request , res : Response) => {

    const {orderId} = req.body;
    
    try {
          
          const id = orderId; // Use `new` with a string
          const deletedOrder = await orderModel.findOneAndDelete({id:id});

        if (!deletedOrder) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully', deletedOrder });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete order' });
    }
}

export default DeleteOrder;