import { Request , Response } from "express";


const YocoPaymentWebHook = async (req : Request , res : Response) => {

    const event = req.body; // Get the event data from Yoco
  
    // Handle the different event types Yoco may send
    if (event.type === 'payment.succeeded') {
      console.log('Payment succeeded:', event);

      // TODO: Update your database, confirm the order, etc.


    } else if (event.type === 'payment.failed') {
      console.log('Payment failed:', event);
      // TODO: Handle the failure case, e.g., notify the user
    }
  
    // Respond with a 200 OK status to acknowledge receipt of the event
    res.sendStatus(200);
  
}

export default YocoPaymentWebHook;
