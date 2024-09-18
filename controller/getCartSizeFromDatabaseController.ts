import { Request , Response } from "express";
import { cartModel } from "../model/cart_schema";
import mongoose from "mongoose";

const GetCartSizeFromDatabaseController = async (request : Request , response : Response) => {

    const {userId} = request.body;

    try {  

        const userIdMongo : mongoose.Schema.Types.ObjectId  = userId;
        const cart = await cartModel.findOne({userId : userIdMongo});

        if(cart){

            const cartSize = cart.items.length;
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
