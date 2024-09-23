import { Document, Types } from 'mongoose';

// Interfaces for embedded schemas

interface CartItem {
 productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image?: string;
}



export interface IAddressForm{

    name: string,
    surname : string,
    address : string,
    apartment : string,
    city : string,
    country : string,
    province:string,
    postalCode: string,
    phoneNumber : string,
}

interface OrderAddress {
  email: string;
  addressDetails: Array<IAddressForm>;
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

interface OrderCheckout {
  userId: Types.ObjectId;
  orderItems: CartItem[];
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
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

interface PaymentMethodDetails {
  card: {
    expiryMonth: number;
    expiryYear: number;
    maskedCard: string;
    scheme: string;
  };
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

export interface IOrder{
  createdDate: Date;
  checkOutObject: OrderCheckout;
  id: string;
  payload: Payload;
  trackingCode: string;
  type: string;
}
