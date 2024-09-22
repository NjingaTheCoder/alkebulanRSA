const mongoose = require('mongoose');
const { Schema } = mongoose;


const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    size: { type: String, required: true },
    image: { type: String }
  });
  

  


const orderAddressSchema = new mongoose.Schema({
    
  email : {
      type:String,
      required:true,
  },
  addressDetails :{
      type : Array,
      required : true,

  }

}
)

const paymentDetailsSchema = new Schema({
  method: {
    type: String,
    enum: ['Credit Card', 'PayPal', 'Stripe', 'Cash on Delivery'], // Add other payment methods as needed
    required: true
  },
  transactionId: {
    type: String, // Transaction ID provided by payment gateway
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    required: true
  }
});


const shippingCostSchema = new Schema({
  cost: {
    type: Number,
    required: true
  },
  deliveryMethod: {
    type: String,
    required: true
  }
});



const orderCheckoutSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [cartItemSchema],
  shippingAddress: {
    type: orderAddressSchema,
    required: true
  },
  billingAddress: {
    type: orderAddressSchema, // Optionally use shippingAddress if billing and shipping are the same
    required: true
  },
  paymentDetails: {
    type: paymentDetailsSchema,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Pending',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  delivery: {
    type: shippingCostSchema,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveryDate: {
    type: Date
  }
});



// Metadata Schema
const metadataSchema = new mongoose.Schema({
  checkoutId: { type: String, required: true },
  productType: { type: String, required: true }
}, { _id: false });

// Payment Method Details Schema
const paymentMethodDetailsSchema = new mongoose.Schema({
  card: {
    // Define card details as per your need (example below):
    expiryMonth: { type: Number, required: true },
    expiryYear: { type: Number, required: true },
    maskedCard: { type: String, required: true },
    scheme: { type: String, required: true }
  },
  type: { type: String, required: true }
}, { _id: false });

// Payload Schema
const payloadSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  createdDate: { type: Date, required: true },
  currency: { type: String, required: true },
  id: { type: String, required: true },
  metadata: metadataSchema,
  mode: { type: String, required: true },
  paymentMethodDetails: paymentMethodDetailsSchema,
  status: { type: String, required: true },
  type: { type: String, required: true }
}, { _id: false });

// Main Schema
const orderSchema = new mongoose.Schema({
  createdDate: { type: Date, required: true },
  checkOutObject : {
    type: orderCheckoutSchema,
    required: true
  },
  id: { type: String, required: true , unique : true },
  payload: payloadSchema,
  trackingCode: { type: String, required: true  , default : 'https://maps.app.goo.gl/AAwQ7R4DNAEKaeNB7'},
  type: { type: String, required: true }
});


export const orderModel = mongoose.model('Orders', orderSchema);


