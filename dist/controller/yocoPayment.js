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
const YocoPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, amount, _csrf } = req.body;
    // Check if the token or amount is missing or invalid
    if (!token || typeof token !== "string" || token.trim() === "") {
        return res.status(400).json({ success: false, message: "Invalid token provided" });
    }
    if (!amount || isNaN(parseInt(amount))) {
        return res.status(400).json({ success: false, message: "Invalid amount provided" });
    }
    try {
        const response = yield axios_1.default.post("https://payments.yoco.com/api/checkouts", {
            token: token,
            amount: parseInt(amount),
            currency: "ZAR",
            successUrl: "https://shop.alkebulanrsa.co.za/account",
            failureUrl: process.env.NODE_ENV === "production"
                ? "https://shop.alkebulanrsa.co.za/failure"
                : "http://localhost:5173/failure", // Handle different environments
        }, {
            headers: {
                Authorization: `Bearer ${process.env.YOCO_API_KEY}`, // Ensure the key is correct
                "Content-Type": "application/json",
            },
        });
        console.log({ paymentData: response.data });
        // Check if the payment session is created and provide the redirect URL
        if (response.data.status === "created" && response.data.redirectUrl) {
            // Send the redirect URL back to the frontend
            return res.json({
                success: true,
                message: "Payment session created. Redirect the user to complete the payment.",
                redirectUrl: response.data.redirectUrl, // Frontend will use this to redirect the user
                paymentData: response.data,
            });
        }
        else {
            // Handle cases where the payment session wasn't created successfully
            return res.json({
                success: false,
                message: "Failed to create the payment session. Please try again.",
            });
        }
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error("Axios error:", {
                message: error.message,
                code: error.code,
                response: error.response
                    ? {
                        status: error.response.status,
                        data: error.response.data,
                    }
                    : null,
            });
        }
        else {
            console.error("Unexpected error:", error);
        }
        return res.status(500).json({ success: false, message: "Payment error" });
    }
});
exports.default = YocoPayment;
