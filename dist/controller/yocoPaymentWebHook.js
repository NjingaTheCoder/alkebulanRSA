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
const product_schema_1 = require("../model/product_schema");
const mongoose_1 = __importDefault(require("mongoose"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailHostUser = process.env.EMAIL_HOST_USER;
const emailHostPassword = process.env.EMAIL_HOST_PASSWORD;
// Setup email transporter
const transporter = nodemailer_1.default.createTransport({
    host: emailHost,
    port: +emailPort,
    secure: false,
    auth: {
        user: emailHostUser,
        pass: emailHostPassword,
    },
});
// Main webhook handler
const YocoPaymentWebHook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const event = req.body;
        const checkoutId = ((_b = (_a = event === null || event === void 0 ? void 0 : event.payload) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.checkoutId) || ((_e = (_d = (_c = event === null || event === void 0 ? void 0 : event.data) === null || _c === void 0 ? void 0 : _c.payload) === null || _d === void 0 ? void 0 : _d.metadata) === null || _e === void 0 ? void 0 : _e.checkoutId);
        const existingOrder = yield order_schema_1.orderModel.findOne({ id: checkoutId }).session(session);
        if (existingOrder) {
            yield session.abortTransaction();
            return res.status(200).json({ message: 'Order already exists' });
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
        yield decreaseProductCount(checkOutObject, res, session);
        yield cart_schema_1.cartModel.deleteOne({ userId: checkOutObject.userId }).session(session);
        yield checkOutObject.deleteOne().session(session);
        yield sendRecieptEmail(checkOutObject);
        yield session.commitTransaction();
        res.status(200).json({ message: 'Transaction successful' });
    }
    catch (error) {
        console.error("Transaction error:", error);
        yield session.abortTransaction();
        res.status(500).json({ error: "Internal Server Error" });
    }
    finally {
        session.endSession();
    }
});
// Send receipt email
const sendRecieptEmail = (checkOutObject) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { email, addressDetails } = checkOutObject.shippingAddress;
    const userName = (_a = addressDetails[0]) === null || _a === void 0 ? void 0 : _a.name;
    const street = (_b = addressDetails[0]) === null || _b === void 0 ? void 0 : _b.address;
    const city = (_c = addressDetails[0]) === null || _c === void 0 ? void 0 : _c.city;
    const zipCode = (_d = addressDetails[0]) === null || _d === void 0 ? void 0 : _d.postalCode;
    const orderItems = checkOutObject.orderItems;
    const totalCost = checkOutObject.totalAmount;
    const deliveryCost = checkOutObject.delivery.cost;
    const receiptHtml = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Thank you for your purchase, ${userName}!</h2>
      <h3>Order Summary</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <thead><tr><th>Item</th><th>Quantity</th><th>Price</th></tr></thead>
        <tbody>
          ${orderItems.map(item => `
            <tr><td>${item.name}</td><td>${item.quantity}</td><td>R${item.price.toFixed(2)}</td></tr>`).join('')}
        </tbody>
      </table>
      <p>SubTotal: R${totalCost.toFixed(2)}</p>
      <p>Delivery Cost: R${deliveryCost.toFixed(2)}</p>
      <p>Total: R${(totalCost + deliveryCost).toFixed(2)}</p>
      <p>Delivery Address: ${street}, ${city}, ${zipCode}</p>
      <p>If you have any questions, feel free to contact us.</p>
    </div>
  `;
    yield transporter.sendMail({
        from: 'Alkebulan Ya Batho <tetelomaake@gmail.com>',
        to: email,
        subject: 'Order Receipt – Alkebulan Shop',
        html: receiptHtml
    });
});
// Decrease product count
const decreaseProductCount = (checkOutObject, res, session) => __awaiter(void 0, void 0, void 0, function* () {
    for (const item of checkOutObject.orderItems) {
        const product = yield product_schema_1.productModel.findById(item.productId).session(session);
        if (product) {
            product.availability = (product.availability || 0) - item.quantity;
            yield product.save({ session });
        }
        else {
            console.error("Product not found");
            yield session.abortTransaction();
            return res.status(400).json({ error: "Product not found" });
        }
    }
});
exports.default = YocoPaymentWebHook;
