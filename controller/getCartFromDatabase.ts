import { Request , Response } from "express";
import { cartModel } from "../model/cart_schema";
import mongoose from "mongoose";


interface ICart{
  productId : mongoose.Schema.Types.ObjectId, 
  name : string, 
  price : number,
  quantity : number, 
  size : string, 
  image : string,
  _id : mongoose.Schema.Types.ObjectId
}

const GetCartFromDatabase = async  (request : Request , response : Response) => {

    
    const {userId} = request.body;

    console.log( `Cart user ID ${userId}`);
    try {  

        const userIdMongo : mongoose.Schema.Types.ObjectId  = userId;
        const cart  = await cartModel.findOne({userId : userIdMongo});

        if(cart){


            const cartSize : ICart = cart.items;
            return response.status(200).send({cart : cartSize , cartID : cartSize._id});
        }else{
            return response.status(500).json({ message: 'Internal Server Error' });
        }
      } catch (error) {
        console.error('Error saving cart:', error);
        return response.status(500).json({ message: 'Internal Server Error' });
      }
}

export default GetCartFromDatabase;
