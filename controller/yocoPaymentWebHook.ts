import { Request, Response } from "express";
import { checkOut } from "../model/check_out_schema";
import { orderModel } from "../model/order_schema";
import { cartModel } from "../model/cart_schema";
import { productModel } from "../model/product_schema";
import mongoose from "mongoose";
import nodemailer, { TransportOptions } from 'nodemailer';
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
    await sendRecieptEmail(checkOutObject);

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

// Send receipt email
const sendRecieptEmail = async (checkOutObject: Checkout) => {
  const { email, addressDetails } = checkOutObject.shippingAddress;
  const userName = addressDetails[0]?.name;
  const street = addressDetails[0]?.address;
  const city = addressDetails[0]?.city;
  const zipCode = addressDetails[0]?.postalCode;
  const orderItems = checkOutObject.orderItems;
  const totalCost = checkOutObject.totalAmount;
  const deliveryCost = checkOutObject.delivery.cost;

  const receiptHtml = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Thank you for your purchase, ${userName}!</h2>
      <h3>Order Summary</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <thead><tr><th>Item</th><th>Quantity</th><th>Price</th></tr></thead>
        <tbody>
          ${orderItems.map(item => `
            <tr><td>${item.name}</td><td>${item.quantity}</td><td>R${item.price.toFixed(2)}</td></tr>`).join('')}
        </tbody>
      </table>
      <p>SubTotal: R${totalCost.toFixed(2)}</p>
      <p>Delivery Cost: R${deliveryCost.toFixed(2)}</p>
      <p>Total: R${(totalCost + deliveryCost).toFixed(2)}</p>
      <p>Delivery Address: ${street}, ${city}, ${zipCode}</p>
      <p>If you have any questions, feel free to contact us.</p>
    </div>
  `;

  await transporter.sendMail({
    from: 'Alkebulan Ya Batho <tetelomaake@gmail.com>',
    to: email,
    subject: 'Order Receipt – Alkebulan Shop',
    html: receiptHtml
  });
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

export default YocoPaymentWebHook;
