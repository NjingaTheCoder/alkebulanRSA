import { Request, Response } from "express";
import { checkOut } from "../model/check_out_schema";

const YocoPaymentWebHook = async (req: Request, res: Response) => {
  try {
    const event = req.body; // Get the event data from Yoco

    console.log("Yoco Webhook event received:", event); // Log the event for debugging

    const checkoutId = event?.data?.id; // Extract checkout ID from the event

    if (!checkoutId) {
      return res.status(400).json({ error: "Missing checkout ID in webhook event" });
    }

    // Find the checkout object using the checkoutId from the webhook event
    const checkOutObject = await checkOut.findOne({ checkoutId });

    if (checkOutObject) {
      await checkOutObject.deleteOne(); // Ensure proper deletion
      console.log("Checkout object deleted successfully");
    }

    // Handle the different event types Yoco may send
    switch (event.type) {
      case "payment.succeeded":
        console.log("Payment succeeded:", event);
        // TODO: Update your database, confirm the order, etc.  jjhu
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

export default YocoPaymentWebHook;
