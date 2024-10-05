import mongoose from "mongoose";
import { checkOut } from "../model/check_out_schema";
import { Request , Response } from "express";


interface ICart{
  productId : mongoose.Schema.Types.ObjectId, 
  name : string, 
  price : number,
  quantity : number, 
  size : string, 
  image : string,
  _id: mongoose.Schema.Types.ObjectId
}

export const createCheckout = async (req: Request, res: Response) => {

  console.log('Check me out man');
  try {
    const { userId, orderItems, shippingAddress, paymentDetails, totalAmount, shippingCost,deliveryMethod, deliveryDate , tax , email } = req.body;

    // Ensure that orderItems is an array of ICart
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ message: 'Order items must be an array and cannot be empty' });
    }

    // Check if required fields are present
    if (!userId || !shippingAddress || !paymentDetails || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }


    const cartExists = await checkOut.findOne({userId : userId});


    if(cartExists){
       await checkOut.deleteOne({userId : userId});
    }

    // Create new checkout instance
    const newCheckout = new checkOut({
      userId,
      orderItems, // Expecting orderItems to be an array of ICart
      shippingAddress : {
        email : email,
        addressDetails : shippingAddress,
      },
      billingAddress : {
        email : email,
        addressDetails : shippingAddress,
      },// Use shipping address if billing is not provided
      paymentDetails,
      totalAmount,
      delivery :{
        cost : shippingCost,
        deliveryMethod : deliveryMethod
      },
      tax,
      deliveryDate : deliveryDate
    });

    // Save the order to the database
    const savedCheckout = await newCheckout.save();

    return res.status(201).json({ message: 'Order successfully placed', order: savedCheckout });
  } catch (error) {
    console.error('Error during checkout creation:', error); // Log the actual error for debugging
    return res.status(500).json({ message: 'Server error', error: error });
  }
};



// Update order status (e.g., from 'Pending' to 'Shipped')
export const updateOrderStatus = async (req : Request, res : Response) => {
  try {
    const { checkoutId } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const updatedCheckout = await checkOut.findByIdAndUpdate(
      checkoutId,
      { orderStatus },
      { new: true }
    );

    if (!updatedCheckout) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order status updated', order: updatedCheckout });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

// Get all orders for a specific user
export const getOrdersByUser = async (req : Request, res : Response) => {
  try {
    const { userId } = req.params;

    const orders = await checkOut.find({ userId }).populate('orderItems.productId');

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

