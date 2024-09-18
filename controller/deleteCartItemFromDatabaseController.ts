import { Request, Response } from "express";
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
  
const DeleteCartItemFromDatabaseController = async (request : Request , response : Response) => {
    const { userId , productId } = request.body;
    const isAuth = request.session.userData?.isAuthenticated || false;

    if (isAuth) {
        try {

            
            const cartObject = await cartModel.findOne({ userId : userId});
            if (cartObject) {

                // Find the index of the address to remove
                const cartIndex = cartObject.items.findIndex((item : ICart) => item._id.toString() === productId);


                if (cartIndex !== -1) {
                   

                    // Remove the address from the array
                    cartObject.items.splice(cartIndex, 1);

                    // Save the updated address list back to the database
                    const newCartArray = await cartObject.save();

                    return response.status(200).send({
                        message: 'Item deleted successfully',
                        cart:  cartObject.items
                    });
                } else {
                    return response.status(404).send({ message: 'Item not found' });
                }
            } else {
                return response.status(404).send({ message: 'User has no cart items' });
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            return response.status(500).send({ message: 'An error occurred while deleting the item' });
        }
    } else {
        return response.status(401).send({ message: 'User is not authenticated' });
    }
}

export default DeleteCartItemFromDatabaseController;
