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
const order_schema_1 = require("./../model/order_schema");
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailHostUser = process.env.EMAIL_HOST_USER;
const emailHostPassword = process.env.EMAIL_HOST_PASSWORD;
const secretKey = process.env.SECRET || 'koffieking';
// Set up email transporter
const transporter = nodemailer_1.default.createTransport({
    host: emailHost,
    port: emailPort,
    secure: false,
    auth: {
        user: emailHostUser,
        pass: emailHostPassword,
    },
});
// Function to send email
const sendOrderUpdateEmail = (userName, email, orderStatus, trackingCode, orderId) => {
    const orderUpdateHtml = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center;">
        <img src="https://i.imgur.com/PA5VTwK.png" alt="Scentor Logo" style="width: 100px; height: auto;" />
      </div>
      <h2>Hello ${userName},</h2>
      <p>Your order <strong>${orderId}</strong> has been updated!</p>
      
      <h3>Order Status: <span style="color: #007bff;">${orderStatus}</span></h3>
      
      <p>We're happy to let you know that your order is progressing. ${orderStatus === 'Shipped' ? 'Your package is on its way!' : ''}</p>

      <p>For tracking your order, you can use the following link:</p>
      <a href="${trackingCode}" target="_blank" style="color: #007bff;">Track Your Order</a>

      <p>If you have any questions or need assistance, feel free to contact us.</p>

      <p>Thank you for shopping with us!<br/>
      The Alkebulan Ya Batho Team 😊</p>
    </div>
  `;
    transporter.sendMail({
        from: 'Alkebulan <alkebulanyabatho@gmail.com>',
        to: `${email}`,
        subject: `Order Update for ${orderId} – Status: ${orderStatus}`,
        html: orderUpdateHtml,
    }, (error, info) => {
        if (error) {
            console.error(`Error sending email: ${error.message}`);
        }
        else {
            console.log(`Order update email sent: ${info.response}`);
        }
    });
};
const UpdateOrderStatusAndTrackingCode = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { ordersArray } = request.body; // Expecting an array of orders with status and tracking code
    // Validate that we actually received an array
    if (!Array.isArray(ordersArray)) {
        return response.status(400).json({ message: "Invalid input. Expected an array of orders." });
    }
    try {
        const updatePromises = ordersArray.map((order) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Destructure the relevant fields from the request body
                const { id, checkOutObject: { orderStatus }, trackingCode } = order;
                // Find the current order in the database
                const existingOrder = yield order_schema_1.orderModel.findOne({ id });
                // Proceed only if there's a change in orderStatus or trackingCode
                if (existingOrder) {
                    const isOrderStatusDifferent = existingOrder.checkOutObject.orderStatus !== orderStatus;
                    const isTrackingCodeDifferent = existingOrder.trackingCode !== trackingCode;
                    if (isOrderStatusDifferent || isTrackingCodeDifferent) {
                        const updatedOrder = yield order_schema_1.orderModel.findOneAndUpdate({ id }, // Query by id (not _id or checkOutObject.id)
                        {
                            $set: {
                                "checkOutObject.orderStatus": orderStatus,
                                trackingCode: trackingCode,
                            },
                        }, { new: true, runValidators: true });
                        // If the update is successful, send an email notification
                        if (updatedOrder) {
                            console.log(order.checkOutObject.billingAddress.addressDetails[0].name, order.checkOutObject.billingAddress.email, orderStatus, trackingCode, id);
                            //sendOrderUpdateEmail(billingAddress.addressDetails[0].name, billingAddress.email, orderStatus, trackingCode, id);
                        }
                        return updatedOrder;
                    }
                }
                return null; // If no update is needed, return null
            }
            catch (error) {
                console.error(`Failed to update order with id ${order.id}:`, error);
                return null; // Handle failure for individual orders
            }
        }));
        const updatedOrders = yield Promise.all(updatePromises);
        response.status(200).json({
            message: "Orders updated successfully",
            data: updatedOrders.filter(Boolean), // Filter out any null results from failed updates
        });
    }
    catch (error) {
        console.error("Error updating orders:", error);
        response.status(500).json({
            message: "Failed to update orders",
            error: error,
        });
    }
});
exports.default = UpdateOrderStatusAndTrackingCode;
