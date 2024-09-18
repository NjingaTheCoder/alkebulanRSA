import mongoose from "mongoose";


// Define the subscription schema

const subscriptionSchema= new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true, // Ensures email is unique
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'], // Basic email validation
    },
    isSubscribed: {
      type: Boolean,
      default: true, // Default is subscribed
    },
    subscribedAt: {
      type: Date,
      default: Date.now, // Automatically set when a user subscribes
    },
    unsubscribedAt: {
      type: Date, // Only set when the user unsubscribes
    },
  });
  
  // Create the Subscription model from the schema
  const Subscription = mongoose.model("Subscription", subscriptionSchema);
  
  export default Subscription;