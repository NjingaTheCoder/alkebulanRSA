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
exports.getOrdersByUser = exports.updateOrderStatus = exports.createCheckout = void 0;
const check_out_schema_1 = require("../model/check_out_schema");
const createCheckout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Check me out man');
    try {
        const { userId, orderItems, shippingAddress, paymentDetails, totalAmount, shippingCost, deliveryMethod, deliveryDate, tax, email } = req.body;
        // Ensure that orderItems is an array of ICart
        if (!Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(400).json({ message: 'Order items must be an array and cannot be empty' });
        }
        // Check if required fields are present
        if (!userId || !shippingAddress || !paymentDetails || !totalAmount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const cartExists = yield check_out_schema_1.checkOut.findOne({ userId: userId });
        if (cartExists) {
            yield check_out_schema_1.checkOut.deleteOne({ userId: userId });
            if (cartExists) {
                const deleted = yield check_out_schema_1.checkOut.deleteOne({ userId: userId });
                console.log('Deleted previous cart:', deleted);
            }
        }
        // Create new checkout instance
        const newCheckout = new check_out_schema_1.checkOut({
            userId,
            orderItems, // Expecting orderItems to be an array of ICart
            shippingAddress: {
                email: email,
                addressDetails: shippingAddress,
            },
            billingAddress: {
                email: email,
                addressDetails: shippingAddress,
            }, // Use shipping address if billing is not provided
            paymentDetails,
            totalAmount,
            delivery: {
                cost: shippingCost,
                deliveryMethod: deliveryMethod
            },
            tax,
            deliveryDate: deliveryDate
        });
        // Save the order to the database
        const savedCheckout = yield newCheckout.save();
        return res.status(201).json({ message: 'Order successfully placed', order: savedCheckout });
    }
    catch (error) {
        console.error('Error during checkout creation:', error); // Log the actual error for debugging
        return res.status(500).json({ message: 'Server error', error: error });
    }
});
exports.createCheckout = createCheckout;
// Update order status (e.g., from 'Pending' to 'Shipped')
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { checkoutId } = req.params;
        const { orderStatus } = req.body;
        const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }
        const updatedCheckout = yield check_out_schema_1.checkOut.findByIdAndUpdate(checkoutId, { orderStatus }, { new: true });
        if (!updatedCheckout) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json({ message: 'Order status updated', order: updatedCheckout });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// Get all orders for a specific user
const getOrdersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const orders = yield check_out_schema_1.checkOut.find({ userId }).populate('orderItems.productId');
        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }
        return res.status(200).json(orders);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
});
exports.getOrdersByUser = getOrdersByUser;
