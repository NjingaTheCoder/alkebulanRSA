import { Request, Response } from "express";
import axios from "axios";

const YocoCreateWebHook = async (req : Request , res : Response) => {

    const { event_types, url } = req.body;

 
    if (!event_types || !url) {
      return res.status(400).json({ message: 'Invalid data provided' });
    }
  
    //this is to everything in check
    try {
      const response = await axios.post(
        'https://payments.yoco.com/api/webhooks',
        JSON.stringify({
          name: 'Alkebulanrsa Payment Webhook', 
          url: url,                   // Webhook URL from frontend
          event_types: event_types,    // Event types from frontend
        }),
        {
          headers: {
           // 'Authorization': `Bearer ${process.env.YOCO_API_KEY}`,
            'Content-Type': 'application/json',
            'Authorization': `Bearer sk_test_8305c53deBL4Kagd7cc41839b7fa`
          },
          withCredentials:true
        }
      );
  
      res.status(200).json(response.data); // Send the successful response back to frontend
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', {
                message: error.message,
                code: error.code,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : null,
            });
        } else {
            console.error('Unexpected error:', error);
        }
      res.status(500).json({ message: 'Failed to create webhook' });
    }


}

export default YocoCreateWebHook;
