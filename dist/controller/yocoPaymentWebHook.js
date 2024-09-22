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
const url_1 = require("url");
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailHostUser = process.env.EMAIL_HOST_USER;
const emailHostPassword = process.env.EMAIL_HOST_PASSWORD;
const secretKey = process.env.SECRET || 'koffieking';
const resetRedirectLink = new url_1.URL(`http://localhost:5173/reset-password`);
//set up email transporter
const transporter = nodemailer_1.default.createTransport({
    host: emailHost,
    port: emailPort,
    secure: false,
    auth: {
        user: emailHostUser,
        pass: emailHostPassword,
    },
});
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
        sendRecieptEmail(checkOutObject);
        decreaseProductCount(checkOutObject, res);
        yield cart_schema_1.cartModel.deleteOne({ userId: checkOutObject.userId }).session(session);
        yield checkOutObject.deleteOne().session(session);
        yield session.commitTransaction();
        console.log("Order created and transaction committed successfully.");
        res.redirect('https://www.linkedin.com/in/tetelo-maake-953500234/');
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
const sendRecieptEmail = (checkOutObject) => {
    var _a, _b;
    let userName;
    let orderItems;
    let totalCost;
    let deliveryCost;
    let street;
    let city;
    let zipCode;
    let email;
    if (checkOutObject) {
        userName = (_a = checkOutObject.shippingAddress.addressDetails[0]) === null || _a === void 0 ? void 0 : _a.name;
        orderItems = checkOutObject.orderItems;
        totalCost = checkOutObject.totalAmount;
        deliveryCost = checkOutObject.delivery.cost;
        street = checkOutObject.shippingAddress.addressDetails[0].address;
        city = checkOutObject.shippingAddress.addressDetails[0].city;
        zipCode = checkOutObject.shippingAddress.addressDetails[0].postalCode;
        email = checkOutObject.shippingAddress.email;
    }
    const receiptHtml = `
  
  <div style="font-family: Arial, sans-serif; color: #333;">
    <img src="" alt="Scentor Logo" style="width: 150px;"/>
    <h2>Thank you for your purchase, ${userName}!</h2>
    <p>
      We are pleased to inform you that we have received your order.
      Below are the details of your purchase:
    </p>
    <h3>Order Summary</h3>
    <table style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr style="background-color: #f2f2f2;">
          <th style="padding: 8px; text-align: left;">Item</th>
          <th style="padding: 8px; text-align: left;">Quantity</th>
          <th style="padding: 8px; text-align: left;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${orderItems === null || orderItems === void 0 ? void 0 : orderItems.map(item => `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">R${item.price.toFixed(2)}</td>
          </tr>`).join('')}
      </tbody>
    </table>
     <p><strong> SubTotal : R${totalCost === null || totalCost === void 0 ? void 0 : totalCost.toFixed(2)}</strong></p>
      <p><strong>Delivery Cost: R${deliveryCost === null || deliveryCost === void 0 ? void 0 : deliveryCost.toFixed(2)}</strong></p>
    <p><strong>Total Amount: R${(_b = ((totalCost || 0) + (deliveryCost || 0))) === null || _b === void 0 ? void 0 : _b.toFixed(2)}</strong></p>
    <p>
      Your order will be delivered to the following address:<br/>
      ${street}, ${city}, ${zipCode}
    </p>
    <p>If you have any questions, feel free to contact us.</p>
    <br/>
    <p>Best regards,<br/>The Alkebulan Ya Batho Team</p>
  </div>
`;
    transporter.sendMail({
        from: 'Scentor <tetelomaake@gmail.com>',
        to: `${email}`,
        subject: 'Your Alkebulan Shop Order Receipt – Thank You for Shopping with Us',
        html: receiptHtml
    });
};
const decreaseProductCount = (checkOutObject, response) => __awaiter(void 0, void 0, void 0, function* () {
    let productObject = null;
    if (checkOutObject) {
        checkOutObject.orderItems.map((item, index) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                productObject = yield product_schema_1.productModel.findOne({ _id: item.productId });
                yield (productObject === null || productObject === void 0 ? void 0 : productObject.updateOne({ availability: ((productObject.availability || 0) - item.quantity) }));
            }
            catch (error) {
                console.error("Transaction error:", error);
                response.status(500).json({ error: "Internal Server Error" });
            }
        }));
        if (productObject === null) {
            console.log('product update failed');
            response.status(400).send('product not found');
        }
        else {
            console.log('product update successfully');
            response.status(200).send('product updated successfully');
        }
    }
});
exports.default = YocoPaymentWebHook;
