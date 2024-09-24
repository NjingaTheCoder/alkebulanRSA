import { Request, Response } from "express";
import { checkOut } from "../model/check_out_schema";
import { orderModel } from "../model/order_schema";
import { cartModel } from "../model/cart_schema";
import { productModel } from "../model/product_schema";
import mongoose from "mongoose";
import nodemailer, { TransportOptions , SentMessageInfo} from 'nodemailer';
import { URL } from 'url';

const emailHost: string | undefined = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailHostUser = process.env.EMAIL_HOST_USER;
const emailHostPassword = process.env.EMAIL_HOST_PASSWORD;

// Setup email transporter
const transporter = nodemailer.createTransport({
  host: emailHost,
  port: +emailPort!,
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
  apartment?: string;
  city: string;
  country: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
  setDefault: boolean;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image?: string;
}

interface Address {
  email: string;
  addressDetails: UserAddress[];
}

interface PaymentDetails {
  method: 'Credit Card' | 'PayPal' | 'Stripe' | 'Cash on Delivery';
  transactionId?: string;
  status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
}

interface ShippingCost {
  cost: number;
  deliveryMethod: string;
}

interface Checkout {
  userId: string;
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
}

interface Metadata {
  checkoutId: string;
  productType: string;
}

interface CardDetails {
  expiryMonth: number;
  expiryYear: number;
  maskedCard: string;
  scheme: string;
}

interface PaymentMethodDetails {
  card: CardDetails;
  type: string;
}

interface Payload {
  amount: number;
  createdDate: Date;
  currency: string;
  id: string;
  metadata: Metadata;
  mode: string;
  paymentMethodDetails: PaymentMethodDetails;
  status: string;
  type: string;
}

interface Order {
  createdDate: Date;
  checkOutObject: Checkout;
  id: string;
  payload: Payload;
  type: string;
}

// Main webhook handler
const YocoPaymentWebHook = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const event = req.body;
    const checkoutId = event?.payload?.metadata?.checkoutId || event?.data?.payload?.metadata?.checkoutId;

    const existingOrder = await orderModel.findOne({ id: checkoutId }).session(session);
    if (existingOrder) {
      await session.abortTransaction();
      return res.status(200).json({ message: 'Order already exists' });
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
    await decreaseProductCount(checkOutObject, res, session);
    await cartModel.deleteOne({ userId: checkOutObject.userId }).session(session);
    await checkOutObject.deleteOne().session(session);
    await sendRecieptEmail(checkOutObject , checkoutId);

    await session.commitTransaction();
    res.status(200).json({ message: 'Transaction successful' });
  } catch (error) {
    console.error("Transaction error:", error);
    await session.abortTransaction();
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    session.endSession();
  }
};


// Decrease product count
const decreaseProductCount = async (checkOutObject: Checkout, res: Response, session: mongoose.ClientSession) => {
  for (const item of checkOutObject.orderItems) {
    const product = await productModel.findById(item.productId).session(session);
    if (product) {
      product.availability = (product.availability || 0) - item.quantity;
      await product.save({ session });
    } else {
      console.error("Product not found");
      await session.abortTransaction();
      return res.status(400).json({ error: "Product not found" });
    }
  }
};


const sendRecieptEmail = (checkOutObject: Checkout , checkoutId : string): void => {
  if (!checkOutObject || !checkOutObject.shippingAddress || !checkOutObject.orderItems) {
    console.error('Checkout object is invalid.');
    return;
  }

  const addressDetails = checkOutObject.shippingAddress.addressDetails[0];
  if (!addressDetails) {
    console.error('Address details missing.');
    return;
  }

  const {
    name: userName,
    address: street,
    city,
    postalCode: zipCode,
  } = addressDetails;
  const { email } = checkOutObject.shippingAddress;
  const orderItems = checkOutObject.orderItems;
  const totalCost = checkOutObject.totalAmount;
  const deliveryCost = checkOutObject.delivery.cost;


  const receiptHtml = `
  
  <div style="font-family: Arial, sans-serif; color: #333;">
    <img src="" alt="Scentor Logo" style="width: 150px;"/>
    <h2>Thank you for your purchase, ${userName}!</h2>
    <p>
      We are pleased to inform you that we have received your order,  Your Order ID is: ${checkoutId}.
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
    <p>Best regards,<br/>Alkebulan Ya Batho Team</p>
  </div>
`;


  transporter.sendMail({
    from: 'Alkebulan <tetelomaake@gmail.com>',
    to: `${email}`,
    subject: 'Your Alkebulan Shop Order Receipt – Thank You for Shopping with Us',
    html: receiptHtml,
  }, (error: Error | null, info: SentMessageInfo) => {
    if (error) {
      console.error(`Error sending email: ${error.message}`);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};



export default YocoPaymentWebHook;
