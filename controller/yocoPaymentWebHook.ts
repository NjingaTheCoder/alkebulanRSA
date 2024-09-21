import { Request, Response } from "express";
import { checkOut } from "../model/check_out_schema";
import { orderModel } from "../model/order_schema";
import { cartModel } from "../model/cart_schema";
import mongoose from "mongoose";


// Cart Item Type
interface CartItem  {
  productId: string; // ObjectId as string
  name: string;
  price: number;
  quantity: number;
  size: string;
  image?: string;
};

// Address Type
interface Address  {
  email: string;
  addressDetails: Array<string>; // Adjust the array type according to the structure you need
};

// Payment Details Type
interface PaymentDetails  {
  method: 'Credit Card' | 'PayPal' | 'Stripe' | 'Cash on Delivery';
  transactionId?: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
};

// Shipping Cost Type
interface ShippingCost  {
  cost: number;
  deliveryMethod: string;
};

// Checkout Type
interface Checkout  {
  userId: string; // ObjectId as string
  orderItems: CartItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentDetails: PaymentDetails;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  totalAmount: number;
  delivery: ShippingCost;
  tax: number;
  orderDate: Date;
  deliveryDate?: Date;
};

// Metadata Type
interface Metadata  {
  checkoutId: string;
  productType: string;
};

// Payment Method Details Type
interface CardDetails  {
  expiryMonth: number;
  expiryYear: number;
  maskedCard: string;
  scheme: string;
};

interface PaymentMethodDetails  {
  card: CardDetails;
  type: string;
};

// Payload Type
interface Payload  {
  amount: number;
  createdDate: Date;
  currency: string;
  id: string;
  metadata: Metadata;
  mode: string;
  paymentMethodDetails: PaymentMethodDetails;
  status: string;
  type: string;
};


// Main Order Type
interface Order  {
  createdDate: Date;
  checkOutObject: Checkout;
  id: string;
  payload: Payload;
  type: string;
};

const YocoPaymentWebHook = async (req: Request, res: Response) => {

  const session = await mongoose.startSession();
  try {
    const event = req.body; // Get the event data from Yoco
    console.log("Yoco Webhook event received:", event);

    const checkoutId = event?.payload?.metadata?.checkoutId || event?.data?.payload?.metadata?.checkoutId;
    console.log(`Extracted checkoutId: ${checkoutId}`);
    session.startTransaction();
    
      const existingOrder = await orderModel.findOne({ id: checkoutId }).session(session);
      if (existingOrder) {
        console.log(`Order with checkoutId ${checkoutId} already exists. Skipping duplicate.`);
        await session.abortTransaction();
        return res.sendStatus(200);
      }
    
      const checkOutObject = await checkOut.findOne({ 'paymentDetails.transactionId': checkoutId }).session(session);
      if (!checkOutObject) {
        await session.abortTransaction();
        return res.status(404).json({ error: "Checkout object not found" });
      }
    
      const newOrder = new orderModel({
        createdDate: event?.createdDate || event?.data?.createdDate,
        checkOutObject,
        id: checkoutId,
        payload: event?.payload || event?.data?.payload,
        type: event?.type || event?.data?.type
      });
    
      await newOrder.save({ session });
      await cartModel.deleteOne({ userId: checkOutObject.userId }).session(session);
      await checkOutObject.deleteOne().session(session);
    
      await session.commitTransaction();
      console.log("Order created and transaction committed successfully.");
      res.sendStatus(200);
    } catch (error) {
      await session.abortTransaction();
      console.error("Transaction error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      session.endSession();
    }
    
};


export default YocoPaymentWebHook;
