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
  

  


const addressSchema = new mongoose.Schema({
    
    email : {
        type:String,
        required:true,
        unique:true
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



const checkoutSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [cartItemSchema],
  shippingAddress: {
    type: addressSchema,
    required: true
  },
  billingAddress: {
    type: addressSchema, // Optionally use shippingAddress if billing and shipping are the same
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




export const checkOut = mongoose.model('Checkout', checkoutSchema);



