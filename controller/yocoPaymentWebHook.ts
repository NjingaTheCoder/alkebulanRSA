import { Request, Response } from "express";
import { checkOut } from "../model/check_out_schema";
import { orderModel } from "../model/order_schema";
import { cartModel } from "../model/cart_schema";
import { IProduct } from "../interface&Objects/IOProdcut";
import { productModel } from "../model/product_schema";
import mongoose from "mongoose";
import nodemailer , {TransportOptions} from 'nodemailer';
import {URL} from 'url';

const emailHost : string | undefined = process.env.EMAIL_HOST ;
const emailPort = process.env.EMAIL_PORT ;
const emailHostUser = process.env.EMAIL_HOST_USER ;
const emailHostPassword = process.env.EMAIL_HOST_PASSWORD ;
const secretKey = process.env.SECRET || 'koffieking';
const resetRedirectLink = new URL(`http://localhost:5173/reset-password`);

//set up email transporter
const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: false, 
    auth: {
      user: emailHostUser,
      pass: emailHostPassword,
    },
  } as TransportOptions);



  interface UserAddress {
    name: string;
    surname: string;
    address: string;
    apartment?: string; // Optional field, as not everyone may have an apartment number
    city: string;
    country: string;
    province: string;
    postalCode: string;
    phoneNumber: string;
    setDefault: boolean; // True if this address should be set as the default
  }
  

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
  addressDetails: Array<UserAddress>; // Adjust the array type according to the structure you need
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
      sendRecieptEmail(checkOutObject);
      decreaseProductCount(checkOutObject , res);
      await cartModel.deleteOne({ userId: checkOutObject.userId }).session(session);
      await checkOutObject.deleteOne().session(session);
    
      await session.commitTransaction();
      console.log("Order created and transaction committed successfully.");
      res.redirect('http://localhost:5173/account');
    } catch (error) {
      await session.abortTransaction();
      console.error("Transaction error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } finally {
      session.endSession();
    }
    
};


const sendRecieptEmail = (checkOutObject : Checkout) => {

  let userName ;
  let orderItems;
  let totalCost;
  let deliveryCost ;
  let street;
  let city;
  let zipCode;
  let email;

  if(checkOutObject){
    userName = checkOutObject.shippingAddress.addressDetails[0]?.name;
    orderItems = checkOutObject.orderItems;
    totalCost = checkOutObject.totalAmount;
    deliveryCost = checkOutObject.delivery.cost;
    street = checkOutObject.shippingAddress.addressDetails[0].address;
    city = checkOutObject.shippingAddress.addressDetails[0].city;
    zipCode = checkOutObject.shippingAddress.addressDetails[0].postalCode;
    email = checkOutObject.shippingAddress.email;
  }

  const receiptHtml = `
  
  <div style="font-family: Arial, sans-serif; color: #333;">
    <img src="" alt="Scentor Logo" style="width: 150px;"/>
    <h2>Thank you for your purchase, ${userName}!</h2>
    <p>
      We are pleased to inform you that we have received your order.
      Below are the details of your purchase:
    </p>
    <h3>Order Summary</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; text-align: left;">Item</th>
          <th style="padding: 8px; text-align: left;">Quantity</th>
          <th style="padding: 8px; text-align: left;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${orderItems?.map(item => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">R${item.price.toFixed(2)}</td>
          </tr>`).join('')}
      </tbody>
    </table>
     <p><strong> SubTotal : R${totalCost?.toFixed(2)}</strong></p>
      <p><strong>Delivery Cost: R${deliveryCost?.toFixed(2)}</strong></p>
    <p><strong>Total Amount: R${((totalCost || 0) + (deliveryCost || 0))?.toFixed(2)}</strong></p>
    <p>
      Your order will be delivered to the following address:<br/>
      ${street}, ${city}, ${zipCode}
    </p>
    <p>If you have any questions, feel free to contact us.</p>
    <br/>
    <p>Best regards,<br/>The Alkebulan Ya Batho Team</p>
  </div>
`;

transporter.sendMail({
        
  from:'Scentor <tetelomaake@gmail.com>',
  to:`${email}`,
  subject:'Your Alkebulan Shop Order Receipt – Thank You for Shopping with Us',
  html:receiptHtml
});


}

const decreaseProductCount = async (checkOutObject : Checkout , response : Response) => {


  let productObject = null;

  if(checkOutObject){

    checkOutObject.orderItems.map( async (item , index) => {

      try {
        
        productObject = await productModel.findOne({_id : item.productId});
        await productObject?.updateOne({availability: ((productObject.availability || 0) - item.quantity)});
      } catch (error) {
        console.error("Transaction error:", error);
        response.status(500).json({ error: "Internal Server Error" });
      }

    });

    if(productObject === null){

      console.log('product update failed');
      response.status(400).send('product not found');
      
    }else{

      console.log('product update successfully');
      response.status(200).send('product updated successfully');
    }
  }
  


}


export default YocoPaymentWebHook;
