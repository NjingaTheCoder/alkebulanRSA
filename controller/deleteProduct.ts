import { Request , Response } from "express";
import { productModel } from "../model/product_schema";
import mongoose , {Types} from "mongoose";

const DeleteProducts = async (req : Request , res : Response) => {

    const {productId} = req.body;
    
    try {
       
          const id = new mongoose.Types.ObjectId(productId); // Use `new` with a string
          const deletedProducts = await productModel.findOneAndDelete({_id: id});

        if (!deletedProducts) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully', deletedProducts });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
}

export default DeleteProducts;