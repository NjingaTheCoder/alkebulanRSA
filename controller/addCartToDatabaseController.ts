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
    _id: mongoose.Schema.Types.ObjectId
}

const AddCartToDatabaseController = async (request: Request, response: Response) => {
  try {
    const { items } = request.body;
    
    const userId = request.session?.userData?.userID;
    const csrfToken  = request.session?.userData?.csrfToken;

    // Stop execution if userID is missing
    if (!userId || !csrfToken) {
      return response.status(400).json({ message: 'Sign in to fill up your cart with ease!' });
    }

    // Validate that items exist in the request
    if (!items || items.length === 0) {
      return response.status(400).json({ message: 'Cart items are required.' });
    }

    const userExist = await cartModel.findOne({ userId });

    const cartArray: ICart[] = items;

    // Calculate total price
    const totalPrice = items.reduce(
      (total: number, item: ICart) => total + item.price * item.quantity,
      0
    );

    const userInfo: mongoose.Schema.Types.ObjectId = userId;

    if (userExist) {
      let updatedTotalPrice = 0;

      userExist.items.map((item: ICart) => {
        updatedTotalPrice += item.price * item.quantity;
      });

      updatedTotalPrice += cartArray[0].price * cartArray[0].quantity;
      const newCartArray = [...cartArray, ...userExist.items];

      await userExist.updateOne({ items: newCartArray });
      await userExist.updateOne({ totalPrice: updatedTotalPrice });
      await userExist.updateOne({ updatedAt: new Date() });

    } else {
      // Create a new cart document
      const cart = new cartModel({
        userId: userInfo,
        items: cartArray,
        totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Save the cart to the database
      await cart.save();
    }

    // Respond with the saved cart data
    return response.status(201).json({ message: 'Cart saved successfully' });
  } catch (error) {
    console.error('Error saving cart:', error);
    return response.status(500).json({ message: 'Internal Server Error' });
  }
};

export default AddCartToDatabaseController;
