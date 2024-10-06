"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const yocoWebhookHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Sending a POST request to Yoco's webhook endpoint
        const response = yield axios_1.default.post('https://payments.yoco.com/api/webhooks', {
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
        }
        else {
            console.log("Yoco webhook responded with a non-200 status code.");
            return res.status(response.status).json({
                message: "Yoco webhook responded with an error",
                statusCode: response.status,
            });
        }
    }
    catch (error) {
        // Error handling for any issues with the Axios request
        console.error("Error processing Yoco webhook:", error);
        return res.status(500).json({
            message: "Error processing Yoco webhook",
            error: error,
        });
    }
});
exports.default = yocoWebhookHandler;
