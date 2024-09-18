import { Request, Response } from "express";
import Subscription from "../interface&Objects/subscriber_schema";

// Subscribe to the newsletter
export const subscribeEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    let subscription = await Subscription.findOne({ email });

    // If email exists and is already subscribed, return a message
    if (subscription && subscription.isSubscribed) {
      return res.status(201).json({ message: "Email is already subscribed." });
    }

    // If the user exists but unsubscribed, resubscribe
    if (subscription) {
      subscription.isSubscribed = true;
      subscription.subscribedAt = new Date();
      subscription.unsubscribedAt = undefined;
    } else {
      // Create a new subscription
      subscription = new Subscription({ email });
    }

    await subscription.save();
    return res.status(201).json({ message: "Subscription successful" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Unsubscribe from the newsletter
export const unsubscribeEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const subscription = await Subscription.findOne({ email });

    if (!subscription || !subscription.isSubscribed) {
      return res.status(404).json({ message: "Email not found or already unsubscribed." });
    }

    subscription.isSubscribed = false;
    subscription.unsubscribedAt = new Date();
    await subscription.save();

    return res.status(200).json({ message: "Successfully unsubscribed." });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export default {subscribeEmail , unsubscribeEmail};
