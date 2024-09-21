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
const check_out_schema_1 = require("../model/check_out_schema");
const order_schema_1 = require("../model/order_schema");
const cart_schema_1 = require("../model/cart_schema");
const mongoose_1 = __importDefault(require("mongoose"));
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
    const session = yield mongoose_1.default.startSession();
    try {
        const event = req.body; // Get the event data from Yoco
        console.log("Yoco Webhook event received:", event);
        const checkoutId = ((_b = (_a = event === null || event === void 0 ? void 0 : event.payload) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.checkoutId) || ((_e = (_d = (_c = event === null || event === void 0 ? void 0 : event.data) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.metadata) === null || _e === void 0 ? void 0 : _e.checkoutId);
        console.log(`Extracted checkoutId: ${checkoutId}`);
        session.startTransaction();
        const existingOrder = yield order_schema_1.orderModel.findOne({ id: checkoutId }).session(session);
        if (existingOrder) {
            console.log(`Order with checkoutId ${checkoutId} already exists. Skipping duplicate.`);
            yield session.abortTransaction();
            return res.sendStatus(200);
        }
        const checkOutObject = yield check_out_schema_1.checkOut.findOne({ 'paymentDetails.transactionId': checkoutId }).session(session);
        if (!checkOutObject) {
            yield session.abortTransaction();
            return res.status(404).json({ error: "Checkout object not found" });
        }
        const newOrder = new order_schema_1.orderModel({
            createdDate: (event === null || event === void 0 ? void 0 : event.createdDate) || ((_f = event === null || event === void 0 ? void 0 : event.data) === null || _f === void 0 ? void 0 : _f.createdDate),
            checkOutObject,
            id: checkoutId,
            payload: (event === null || event === void 0 ? void 0 : event.payload) || ((_g = event === null || event === void 0 ? void 0 : event.data) === null || _g === void 0 ? void 0 : _g.payload),
            type: (event === null || event === void 0 ? void 0 : event.type) || ((_h = event === null || event === void 0 ? void 0 : event.data) === null || _h === void 0 ? void 0 : _h.type)
        });
        yield newOrder.save({ session });
        yield cart_schema_1.cartModel.deleteOne({ userId: checkOutObject.userId }).session(session);
        yield checkOutObject.deleteOne().session(session);
        yield session.commitTransaction();
        console.log("Order created and transaction committed successfully.");
        res.sendStatus(200);
    }
    catch (error) {
        yield session.abortTransaction();
        console.error("Transaction error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    finally {
        session.endSession();
    }
});
exports.default = YocoPaymentWebHook;
