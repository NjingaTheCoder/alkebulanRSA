// webhookController.js
import { Request , Response } from "express";
import axios from "axios";

const yocoWebhookHandler = async (req : Request, res : Response) => {
    try {

        // Sending a POST request to Yoco's webhook endpoint
        const response = await axios.post('https://payments.yoco.com/api/webhooks', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer sk_test_8305c53deBL4Kagd7cc41839b7fa`, // Use your Yoco API Key
            }
        });

        // Handling success response from Yoco
        if (response.status === 200) {
            console.log("Webhook processed successfully:", response.data);
            return res.status(200).json({
                message: "Webhook processed successfully",
                yocoResponse: response.data,
            });
        } else {
            console.log("Yoco webhook responded with a non-200 status code.");
            return res.status(response.status).json({
                message: "Yoco webhook responded with an error",
                statusCode: response.status,
            });
        }
    } catch (error) {
        // Error handling for any issues with the Axios request
        console.error("Error processing Yoco webhook:", error);
        return res.status(500).json({
            message: "Error processing Yoco webhook",
            error: error,
        });
    }
};

export default yocoWebhookHandler;
