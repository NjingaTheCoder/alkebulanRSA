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
Object.defineProperty(exports, "__esModule", { value: true });
const check_out_schema_1 = require("../model/check_out_schema");
;
;
;
;
;
;
;
;
;
;
const YocoPaymentWebHook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const event = req.body; // Get the event data from Yoco
        console.log("Yoco Webhook event received:", event); // Log the event for debugging
        const checkoutId = event === null || event === void 0 ? void 0 : event.payload.id; // Extract checkout ID from the event
        console.log(`missing id : ${event === null || event === void 0 ? void 0 : event.payload.id}`);
        if (!checkoutId) {
            return res.status(400).json({ error: "Missing checkout ID in webhook event" });
        }
        // Find the checkout object using the checkoutId from the webhook event
        const checkOutObject = yield check_out_schema_1.checkOut.findOne({ 'paymentDetails.transactionId': checkoutId });
        console.log(checkOutObject);
        if (checkOutObject) {
            // Create a new order using the Mongoose model
            const newOrder = new check_out_schema_1.orderModel({
                createdDate: (_a = event === null || event === void 0 ? void 0 : event.data) === null || _a === void 0 ? void 0 : _a.createdDate,
                checkOutObject,
                id: checkoutId,
                payload: (_b = event === null || event === void 0 ? void 0 : event.data) === null || _b === void 0 ? void 0 : _b.payload,
                type: (_c = event === null || event === void 0 ? void 0 : event.data) === null || _c === void 0 ? void 0 : _c.type
            });
            if (newOrder) {
                yield checkOutObject.deleteOne(); // Ensure proper deletion
                console.log("Checkout object deleted successfully");
            }
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
    }
    catch (error) {
        console.error("Error handling Yoco webhook:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = YocoPaymentWebHook;
