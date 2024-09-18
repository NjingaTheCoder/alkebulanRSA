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
const YocoPaymentWebHook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const event = req.body; // Get the event data from Yoco
    // Handle the different event types Yoco may send
    if (event.type === 'payment.succeeded') {
        console.log('Payment succeeded:', event);
        // TODO: Update your database, confirm the order, etc.
    }
    else if (event.type === 'payment.failed') {
        console.log('Payment failed:', event);
        // TODO: Handle the failure case, e.g., notify the user
    }
    // Respond with a 200 OK status to acknowledge receipt of the event
    res.sendStatus(200);
});
exports.default = YocoPaymentWebHook;
