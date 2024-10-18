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
        yield sendRecieptEmail(checkOutObject, checkoutId);
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
const sendRecieptEmail = (checkOutObject, checkoutId) => {
    var _a;
    if (!checkOutObject || !checkOutObject.shippingAddress || !checkOutObject.orderItems) {
        console.error('Checkout object is invalid.');
        return;
    }
    const addressDetails = checkOutObject.shippingAddress.addressDetails[0];
    if (!addressDetails) {
        console.error('Address details missing.');
        return;
    }
    const { name: userName, address: street, city, postalCode: zipCode, } = addressDetails;
    const { email } = checkOutObject.shippingAddress;
    const orderItems = checkOutObject.orderItems;
    const totalCost = checkOutObject.totalAmount;
    const deliveryCost = checkOutObject.delivery.cost;
    const receiptHtml = `
  <div style="font-family: Arial, sans-serif; color: #333;">
    <div style="text-align: center;">
      <img src="https://i.imgur.com/PA5VTwK.png" alt="Scentor Logo" style="width: 100px; height: auto;" />
    </div>
    <h2>Thank you for your purchase, ${userName}!</h2>
    <p>
      We are pleased to inform you that we have received your order. Your Order ID is: ${checkoutId}.
      Below are the details of your purchase:
    </p>
    <h3>Order Summary</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; text-align: left;">Image</th>
          <th style="padding: 8px; text-align: left;">Item</th>
          <th style="padding: 8px; text-align: left;">Quantity</th>
          <th style="padding: 8px; text-align: left;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${orderItems === null || orderItems === void 0 ? void 0 : orderItems.map(item => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">
              <img src="${item.image}" alt="product" style="width: 70px; height: auto;" />
            </td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">R${item.price.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p><strong> SubTotal : R${totalCost === null || totalCost === void 0 ? void 0 : totalCost.toFixed(2)}</strong></p>
    <p><strong>Delivery Cost: R${deliveryCost === null || deliveryCost === void 0 ? void 0 : deliveryCost.toFixed(2)}</strong></p>
    <p><strong>Total Amount: R${(_a = ((totalCost || 0) + (deliveryCost || 0))) === null || _a === void 0 ? void 0 : _a.toFixed(2)}</strong></p>
    <p>
      Your order will be delivered to the following address:<br/>
      ${street}, ${city}, ${zipCode}
    </p>
    <p>If you have any questions, feel free to contact us.</p>
    <br/>
    <p>Best regards,<br/>Alkebulan Ya Batho Team</p>
  </div>
`;
    transporter.sendMail({
        from: 'Alkebulan <alkebulanyabatho@gmail.com>',
        to: `${email},alkebulanyabatho@gmail.com`,
        subject: 'Your Alkebulan Shop Order Receipt – Thank You for Shopping with Us',
        html: receiptHtml,
    }, (error, info) => {
        if (error) {
            console.error(`Error sending email: ${error.message}`);
        }
        else {
            console.log(`Email sent: ${info.response}`);
        }
    });
};
exports.default = YocoPaymentWebHook;
