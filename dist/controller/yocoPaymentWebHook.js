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
const order_schema_1 = require("../model/order_schema");
const cart_schema_1 = require("../model/cart_schema");
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
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const event = req.body; // Get the event data from Yoco
        console.log("Yoco Webhook event received:", event);
        const checkoutId = ((_b = (_a = event === null || event === void 0 ? void 0 : event.payload) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.checkoutId) || ((_e = (_d = (_c = event === null || event === void 0 ? void 0 : event.data) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.metadata) === null || _e === void 0 ? void 0 : _e.checkoutId);
        console.log(`Extracted checkoutId: ${checkoutId}`);
        if (!checkoutId) {
            return res.status(400).json({ error: "Missing checkout ID in webhook event" });
        }
        // **Check if an order with this checkoutId already exists**
        const existingOrder = yield order_schema_1.orderModel.findOne({ id: checkoutId });
        if (existingOrder) {
            console.log(`Order with checkoutId ${checkoutId} already exists. Skipping duplicate.`);
            return res.sendStatus(200); // Acknowledge the webhook but do nothing
        }
        // Find the checkout object using the checkoutId from the webhook event
        const checkOutObject = yield check_out_schema_1.checkOut.findOne({ 'paymentDetails.transactionId': checkoutId });
        if (checkOutObject) {
            const newOrder = new order_schema_1.orderModel({
                createdDate: (event === null || event === void 0 ? void 0 : event.createdDate) || ((_f = event === null || event === void 0 ? void 0 : event.data) === null || _f === void 0 ? void 0 : _f.createdDate),
                checkOutObject,
                id: checkoutId,
                payload: (event === null || event === void 0 ? void 0 : event.payload) || ((_g = event === null || event === void 0 ? void 0 : event.data) === null || _g === void 0 ? void 0 : _g.payload),
                type: (event === null || event === void 0 ? void 0 : event.type) || ((_h = event === null || event === void 0 ? void 0 : event.data) === null || _h === void 0 ? void 0 : _h.type)
            });
            yield newOrder.save(); // Save the new order
            yield cart_schema_1.cartModel.deleteOne({ userId: checkOutObject.userId });
            yield checkOutObject.deleteOne();
            console.log("Checkout object and cart deleted successfully");
        }
        // Handle event types like payment success or failure
        switch (event.type) {
            case "payment.succeeded":
                console.log("Payment succeeded:", event);
                break;
            case "payment.failed":
                console.log("Payment failed:", event);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
                break;
        }
        res.sendStatus(200); // Respond with 200 OK
    }
    catch (error) {
        console.error("Error handling Yoco webhook:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = YocoPaymentWebHook;
