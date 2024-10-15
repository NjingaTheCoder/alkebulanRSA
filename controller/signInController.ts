import { Response , Request } from "express";
import { userModel } from '../model/user_schema';
import sessionModel from "../model/session_schema";
import bcrypt from 'bcrypt';
import { cartModel } from "../model/cart_schema";
import mongoose from "mongoose";
import { Types } from 'mongoose';

interface CartItem {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  _id: Types.ObjectId;
}

interface Cart {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: CartItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}





const SignInController =  async ( request : Request ,  response : Response) => {

    
  
    const {email , password ,  _csrf} = request.body;

    try {
        const user = await userModel.findOne({ email_address: email });
    
        if (!user) {
          return response.status(401).send({ error: 'Invalid email or password' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
          return response.status(401).send({ error: 'Invalid email or password' });
        }

        await sessionModel.findOneAndDelete({ 'session.userData.userEmail': email });

        //object for storing user data
        request.session.userData = {

            isAuthenticated : true,
            forgotPassword : false,
            userID : user._id,
            userEmail : user.email_address,
            userName : user.name,
            userSurname : user.surname,
            userPhoneNumber : user.phone_number, 
            csrfToken :  _csrf

        }


        // Get current date
        const currentDate = new Date();
        const last_logged_date = currentDate.toISOString();
        //update last loggin date
        await user.updateOne({last_logged_in:last_logged_date});

        
        const guestCart = await cartModel.findOne({ userId: request.session?.guestCart?.userId });
        const userCart = await cartModel.findOne({ userId: user._id });
        
        if (userCart && guestCart) {
            // Merge items (you might need to define your own merging logic based on your schema)
            guestCart.items.forEach((item : CartItem ) => {
                const existingItem = userCart.items.find((cartItem : CartItem)  => cartItem.productId.equals(item?.productId));
                if (existingItem) {
                    existingItem.quantity += item.quantity;  // Update quantity
                } else {
                    userCart.items.push(item);  // Add new item
                }
            });
            await userCart.save();  // Save updated user cart
        } else if (guestCart) {
            guestCart.userId = user._id;
            await guestCart.save();
        }
        
        // Clean up guest cart session after merging
        delete request.session?.guestCart?.userId;
    

         // Save session and return success
        request.session.save((err) => {
          if (err) {
            console.error('Error saving session:', err);
            return response.status(500).send({ error: 'Session error' });
          }
          console.log('Session data after login:', request.session);
          response.status(200).send({ message: 'Login successful' });
        });
      } catch (error) {
        console.error('Error during login:', error);
        response.status(500).send({ error: 'Internal server error' });
      }

}

export default SignInController;
