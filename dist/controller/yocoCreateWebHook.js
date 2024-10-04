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
const YocoCreateWebHook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { event_types, url } = req.body;
    if (!event_types || !url) {
        return res.status(400).json({ message: 'Invalid data provided' });
    }
    //this is to everything in check
    try {
        const response = yield axios_1.default.post('https://payments.yoco.com/api/webhooks', ({
            name: 'Alkebulanrsa Payment Webhook',
            url: url, // Webhook URL from frontend
            event_types: event_types, // Event types from frontend
        }), {
            headers: {
                // 'Authorization': `Bearer ${process.env.YOCO_API_KEY}`,
                'Content-Type': 'application/json',
                'Authorization': `Bearer sk_test_8305c53deBL4Kagd7cc41839b7fa`
            }
        });
        res.status(200).json(response.data); // Send the successful response back to frontend
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Axios error:', {
                message: error.message,
                code: error.code,
                response: error.response ? {
                    status: error.response.status,
                    data: error.response.data,
                } : null,
            });
        }
        else {
            console.error('Unexpected error:', error);
        }
        res.status(500).json({ message: 'Failed to create webhook' });
    }
});
exports.default = YocoCreateWebHook;
