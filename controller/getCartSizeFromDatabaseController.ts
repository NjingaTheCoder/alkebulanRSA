import { Request , Response } from "express";
import { cartModel } from "../model/cart_schema";
import mongoose from "mongoose";

interface IProduct {
  _id: mongoose.Schema.Types.ObjectId;          // Unique identifier for the document
  productId: string;    // Product ID
  name: string;         // Product name
  price: number;        // Price of the product
  quantity: number;     // Quantity of the product
  size: string;         // Size or dimension of the product
  image: string;        // URL or path to the product image
}


const GetCartSizeFromDatabaseController = async (request : Request , response : Response) => {

    const {userId} = request.body;

    try {  

        const userIdMongo : mongoose.Schema.Types.ObjectId  = userId;
        const cart = await cartModel.findOne({userId : userIdMongo});

        if(cart){

          let totalCount = 0;
          cart.items.map((item : IProduct , index : number) => {

            totalCount = totalCount +  item.quantity;
          });

          const cartSize = totalCount;
          return response.status(200).send({cartSize : cartSize});
        }else{
            return response.status(500).json({ message: 'Internal Server Error' });
        }
      } catch (error) {
        console.error('Error saving cart:', error);
        return response.status(500).json({ message: 'Internal Server Error' });
      }

}

export default GetCartSizeFromDatabaseController;
