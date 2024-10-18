import { Request, Response } from "express";
import mongoose from "mongoose";
import { orderModel } from './../model/order_schema';

const UpdateOrders = async (request: Request, response: Response) => {
  const { ordersArray } = request.body; // Expecting an array of orders in the request body

  // Validate that we received an array
  if (!Array.isArray(ordersArray)) {
    return response.status(400).json({ message: "Invalid input. Expected an array of orders." });
  }

  try {
    const updatePromises = ordersArray.map(async (order: { id: string, orderStatus: string, trackingCode: string }) => {
      try {
        // Check if the order has a valid id
        if (!order.id) {
          throw new Error("Order ID is missing");
        }

        // Convert id to ObjectId if it's a string
        const id = typeof order.id === 'string' ? new mongoose.Types.ObjectId(order.id) : order.id;

        // Only update the `orderStatus` and `trackingCode` fields
        const updateData = {
          'checkOutObject.orderStatus': order.orderStatus,
          trackingCode: order.trackingCode
        };

        return await orderModel.findByIdAndUpdate(id, updateData, {
          new: true, // Return the updated document
          runValidators: true, // Ensures model validation runs
        });
      } catch (error) {
        console.error(`Failed to update order with id ${order.id || 'unknown'}:`, error || error);
        return null; // Handle failure for individual orders
      }
    });

    // Wait for all update promises to resolve
    const updatedOrders = await Promise.all(updatePromises);

    // Filter out any null results
    const successfulUpdates = updatedOrders.filter(Boolean);

    if (successfulUpdates.length === 0) {
      return response.status(500).json({ message: "No orders were updated successfully." });
    }

    // Respond with the successfully updated orders
    return response.status(200).json({
      message: "Orders updated successfully",
      data: successfulUpdates,
    });
  } catch (error) {
    console.error("Error updating orders:", error);
    return response.status(500).json({
      message: "Failed to update orders due to a server error.",
      error: error || error,
    });
  }
};

export default UpdateOrders;
