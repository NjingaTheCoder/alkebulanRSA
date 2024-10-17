import { Request, Response } from "express";
import { IOrder } from "../interface&Objects/IOrder";
import mongoose from "mongoose";
import { orderModel } from './../model/order_schema';

const UpdateOrders = async (request: Request, response: Response) => {
  const { ordersArray } = request.body; // Expecting an array of order objects in the request body

  // Validate that we actually received an array
  if (!Array.isArray(ordersArray)) {
    return response.status(400).json({ message: "Invalid input. Expected an array of orders." });
  }

  try {
    const updatePromises = ordersArray.map(async (order: IOrder) => {
      try {
        // Ensure the id is converted to ObjectId if it's a string
        const id = typeof order.id === 'string' ? new mongoose.Types.ObjectId(order.id) : order.id;

        // Destructure to exclude id from the update data
        const { id: _, ...updateData } = order;

        return orderModel.findByIdAndUpdate(id, updateData, {
          new: true, // Returns the updated document
          runValidators: true, // Ensures model validation runs
        });
      } catch (error) {
        console.error(`Failed to update order with id ${order.id}:`, error);
        return null; // Handle failure for individual orders
      }
    });

    const updatedOrders = await Promise.all(updatePromises);

    response.status(200).json({
      message: "Orders updated successfully",
      data: updatedOrders.filter(Boolean), // Remove any null results from failed updates
    });
  } catch (error) {
    console.error("Error updating orders:", error);
    response.status(500).json({
      message: "Failed to update orders",
      error: error || error,
    });
  }
};

export default UpdateOrders;
