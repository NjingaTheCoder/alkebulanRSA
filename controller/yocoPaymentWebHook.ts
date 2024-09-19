import { Request, Response } from "express";
import { checkOut } from "../model/check_out_schema";


const YocoPaymentWebHook = async (req: Request, res: Response) => {
  try {
    const event = req.body; // Get the event data from Yoco
    const userId = req.session?.userData?.userID;

    if (!userId) {
      return res.status(400).json({ error: "User ID is missing from session data" });
    }

    // Find the checkout object associated with the user
    const checkOutObject = await checkOut.findOne({ userId });

    if (checkOutObject) {
      await checkOutObject.deleteOne(); // Ensure proper deletion
      console.log("Checkout object deleted successfully");
    }

    // Handle the different event types Yoco may send
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
