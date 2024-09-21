import { Request, Response } from "express";
import { checkOut , orderModel} from "../model/check_out_schema";

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
  try {
    const event = req.body; // Get the event data from Yoco
    console.log("Yoco Webhook event received:", event); // Log the event for debugging

    const checkoutId = event?.payload?.metadata?.checkoutId || event?.data?.payload?.metadata?.checkoutId; // Extract checkout ID from the event
    console.log(`Extracted checkoutId: ${checkoutId}`); 

    if (!checkoutId) {
      return res.status(400).json({ error: "Missing checkout ID in webhook event" });
    }

    // Find the checkout object using the checkoutId from the webhook event
    const checkOutObject = await checkOut.findOne({ 'paymentDetails.transactionId': checkoutId });

    if (checkOutObject) {
      // Create a new order using the Mongoose model
      const newOrder = new orderModel({
        createdDate: event?.createdDate || event?.data?.createdDate,
        checkOutObject,
        id: checkoutId,
        payload: event?.payload || event?.data?.payload,
        type: event?.type || event?.data?.type
      });

      await newOrder.save(); // Save the new order

      // Ensure proper deletion after saving the new order
      await checkOutObject.deleteOne();
      console.log("Checkout object deleted successfully");
    }

    // Handle different event types Yoco may send
    switch (event.type) {
      case "payment.succeeded":
        console.log("Payment succeeded:", event);
        // TODO: Update your database, confirm the order, etc.
        break;

      case "payment.failed":
        console.log("Payment failed:", event);
        // TODO: Handle the failure case, e.g., notify the user
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    // Respond with a 200 OK status to acknowledge receipt of the event
    res.sendStatus(200);
  } catch (error) {
    console.error("Error handling Yoco webhook:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
};

export default YocoPaymentWebHook;
